(ns parva-pila-rex.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.json :as ring-json]
            [ring.util.response :as rr]))

(defroutes app-routes
  (GET "/regexes" []
         (rr/response [{:regex "abc"} {:regex "def"}]))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
    (ring-json/wrap-json-response)
    (wrap-defaults site-defaults)))
