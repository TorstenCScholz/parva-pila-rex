(ns parva-pila-rex.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.json :as ring-json]
            [ring.util.response :as rr]))

(defrecord Regex [id name description matches])
(defrecord Matches [public private])

(def regexes (atom #{
  (Regex. 0 "Basic 1" "A very simple regular expression"
          (Matches. { :positive [ "This is a test" "I should match, too" ]
                      :negative [ "This number 5 should not match" "123" ]}
                    { :positive []
                      :negative [] }))}))

(defn update-regexes [regex action]
  (swap! regexes #(action % regex)))

(defn conj-cond [seq cond-fn]
  (filter (complement cond-fn) seq))

(defroutes app-routes
  (GET "/regexes" []
    (rr/response @regexes))
  (POST "/regexes" request
    (update-regexes (:body request) conj)
    (rr/response @regexes))
  (DELETE "/regexes" request
    (update-regexes (:body request) disj)
    (rr/response @regexes))
  (route/not-found (slurp "resources/public/404.html")))

(def app
  (-> app-routes
    (ring-json/wrap-json-response)
    (ring-json/wrap-json-body)
    (wrap-defaults (assoc-in site-defaults [:security :anti-forgery] false))))
