(ns parva-pila-rex.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs-http.client :as http]
            [cljs.core.async :refer [<! >!]]
            [enfocus.core :as ef]
            [enfocus.events :as ev]))

(defn append-li [content]
  (when (:name content)
    (ef/append
      (ef/html [:li
                 {:class "list-group-item"}
                 [:h3 (:name content)]
                 [:p {:class "small"} (:desc content)]
                 [:code (:regex content)]]))))

(defn update-regex-list [regexes]
  (ef/at "#regex-list" (ef/content nil))
  (doseq [regex regexes]
    (ef/at "#regex-list" (append-li regex))))

(defn ^:export init []
  (go
    (let [response (<! (http/get "/regexes"))
          regexes (:body response)]
      (update-regex-list regexes)
      (ef/at "#btn-create-regex" (ev/listen
                                   :click
                                   #(go (update-regex-list (:body (<! (http/post "/regexes"
                                      {:json-params
                                        {:name (ef/from "#input-regex-name" (ef/get-prop :value))
                                         :desc (ef/from "#input-regex-desc" (ef/get-prop :value))
                                         :regex (ef/from "#input-regex" (ef/get-prop :value))}})))))))

      (ef/at "#btn-delete-regex" (ev/listen
                                  :click
                                  #(go (update-regex-list (:body (<! (http/delete "/regexes"
                                     {:json-params
                                       {:name (ef/from "#input-regex-name" (ef/get-prop :value))
                                        :desc (ef/from "#input-regex-desc" (ef/get-prop :value))
                                        :regex (ef/from "#input-regex" (ef/get-prop :value))}}))))))))))
