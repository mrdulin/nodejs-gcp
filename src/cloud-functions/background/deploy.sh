FUNCTION_NAME='helloPubSub'
PUBSUB_TOPIC='DeleteQ'

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${PUBSUB_TOPIC} --trigger-event google.pubsub.topic.publish