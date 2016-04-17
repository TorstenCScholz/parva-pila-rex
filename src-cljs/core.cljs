(ns parva-pila-rex.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs-http.client :as http]
            [cljs.core.async :refer [<!]]
            [enfocus.core :as ef]))

(defn append-li [content]
  (ef/append
    (ef/html [:li {:class "list-group-item"} [:code content]])))

(defn ^:export init []
  (go
    (let [response (<! (http/get "/regexes"))
          regexes (:body response)]
      (doseq [regex regexes]
        (ef/at "#regex-list" (append-li (:regex regex)))))))
