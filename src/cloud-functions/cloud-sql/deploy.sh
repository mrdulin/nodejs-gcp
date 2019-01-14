#!/bin/bash

FUNCTION_NAME='schedulerWorker'
PUBSUB_TOPIC='scheduleJob'

gcloud beta functions deploy ${FUNCTION_NAME} \
  --runtime nodejs6 \
  --trigger-resource ${PUBSUB_TOPIC} \
  --trigger-event google.pubsub.topic.publish \
  --env-vars-file ./.env.yaml
  
