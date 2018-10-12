FUNCTION_NAME=afterTimeout

npm run build

gcloud config configurations activate me

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-http --timeout=5s