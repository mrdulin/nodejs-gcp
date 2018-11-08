FUNCTION_NAME='designMessage'
PUBSUB_TOPIC='design-message'

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${PUBSUB_TOPIC} --trigger-event google.pubsub.topic.publish --memory=128MB