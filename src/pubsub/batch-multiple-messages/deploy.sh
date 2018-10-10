TOPIC=batch-multiple-messages
FUNCTION_NAME_1=batchMultipleMessage
FUNCTION_NAME_2=batchMultipleMessage2

echo "start to deploy cloud functions\n"
gcloud beta functions deploy ${FUNCTION_NAME_1} --trigger-resource ${TOPIC} --trigger-event google.pubsub.topic.publish
gcloud beta functions deploy ${FUNCTION_NAME_2} --trigger-resource ${TOPIC} --trigger-event google.pubsub.topic.publish
echo "Deploy cloud functions finished"