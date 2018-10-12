SUB_NAME=deadletter-sub

gcloud config configurations activate me
gcloud pubsub subscriptions pull ${SUB_NAME} --limit=10
