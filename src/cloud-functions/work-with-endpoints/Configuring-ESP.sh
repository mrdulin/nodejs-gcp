#!/bin/bash

PROJECT_ID=shadowsocks-218808
ESP_PROJECT_NUMBER=16536262744
FUNCTION_NAME=HelloGet
ENDPOINTS_SERVICE_NAME=endpoints-cloudfunctions-ai6h5wfa2a-uc.a.run.app
CLOUD_RUN_SERVICE_NAME=endpoints-cloudfunctions

gcloud beta run services update ${CLOUD_RUN_SERVICE_NAME} \
   --set-env-vars ENDPOINTS_SERVICE_NAME=${ENDPOINTS_SERVICE_NAME} \
   --project ${PROJECT_ID} \
   --platform managed
   
# Grant ESP permission to invoke your functions.
gcloud beta functions add-iam-policy-binding ${FUNCTION_NAME} \
    --member "serviceAccount:${ESP_PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role "roles/cloudfunctions.invoker" \
    --project ${PROJECT_ID}
