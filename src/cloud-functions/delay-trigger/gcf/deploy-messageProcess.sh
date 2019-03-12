functionName=messageProcess
topicName=message-process

gcloud beta functions deploy ${functionName} --trigger-resource ${topicName} --trigger-event google.pubsub.topic.publish