FUNCTION_NAME=sendEmailBySendgrid

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-http --env-vars-file .env.yaml --memory 128MB