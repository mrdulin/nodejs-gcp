functionName=createUser
topicName=create-user

gcloud beta functions deploy ${functionName} --trigger-resource ${topicName} --trigger-event google.pubsub.topic.publish