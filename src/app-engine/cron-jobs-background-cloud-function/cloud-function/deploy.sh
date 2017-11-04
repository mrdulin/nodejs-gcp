FUNCTION_NAME='cronJobsBackgroundFunction'
TOPIC_NAME='createEmail'

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${TOPIC_NAME} --trigger-event google.pubsub.topic.publish