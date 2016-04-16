(ns parva-pila-rex.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs-http.client :as http]
            [cljs.core.async :refer [<!]]))

(defn ^:export init []
  (go
    (let [response (<! (http/get "/regexes"))]
      (js/alert (:body response)))))
