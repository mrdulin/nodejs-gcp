TOPIC=retry
FUNCTION_NAME=retryFunction

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${TOPIC} --trigger-event google.pubsub.topic.publish