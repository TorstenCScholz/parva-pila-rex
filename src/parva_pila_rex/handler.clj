(ns parva-pila-rex.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.json :as ring-json]
            [ring.util.response :as rr]))

(def regexes (atom #{
  {:name "Basic 1" :desc "A very simple regular expression" :regex (str #"ROFLROFL")}
  {:name "Basic 2" :desc "A very simple regular expression" :regex (str #"^rofl$")}
  {:name "German date" :desc "Tests if the given input denotes a German date" :regex (str #"\d{2}\.\d{2}\.\d{4}")}}))

(defn update-regexes [regex action]
  (when-not (get (:name regex) @regexes)
    (swap! regexes #(action % regex))))

(defroutes app-routes
  (GET "/regexes" []
    (rr/response @regexes))
  (POST "/regexes" request
    (update-regexes (:body request) conj)
    (rr/response @regexes))
  (DELETE "/regexes" request
    (update-regexes (:body request) disj)
    (rr/response @regexes))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
    (ring-json/wrap-json-response)
    (ring-json/wrap-json-body)
    (wrap-defaults (assoc-in site-defaults [:security :anti-forgery] false))))
