EMAIL_TOPIC=email
FUNCTION_NAME=sendEmail

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${EMAIL_TOPIC} --trigger-event google.pubsub.topic.publish --env-vars-file .env.yaml