#!/bin/bash

FUNCTION_NAME='schedulerJob'
PUBSUB_TOPIC='schedulerJob'
ACCOUNT='novaline.dulin@gmail.com'

account=$(gcloud config get-value account)
echo "account: $account"

if [[ $account = $ACCOUNT ]];
then
  gcloud beta functions deploy ${FUNCTION_NAME} \
  --runtime nodejs6 \
  --trigger-resource ${PUBSUB_TOPIC} \
  --trigger-event google.pubsub.topic.publish;
else
  echo "project is not correct, using 'gcloud config configurations activate' command to change project";
fi





  