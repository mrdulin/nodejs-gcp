RETRY_TOPIC=retry
FUNCTION_NAME=retryFunction

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${RETRY_TOPIC} --trigger-event google.pubsub.topic.publish --timeout 10