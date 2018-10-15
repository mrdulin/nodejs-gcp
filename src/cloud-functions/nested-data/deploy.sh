FUNCTION_NAME=nestedData
PUBSUB_TOPIC=nestedData
GCLOUD_CONFIG_NAME=me

gcloud config configurations activate ${GCLOUD_CONFIG_NAME};

../../../node_modules/.bin/ts-node ./init.ts

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-resource ${PUBSUB_TOPIC} --trigger-event google.pubsub.topic.publish