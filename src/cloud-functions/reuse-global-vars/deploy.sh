FUNCTION_NAME=reuseGlobalVars
CONFIGURATION=me

npm run build

gcloud config configurations activate ${CONFIGURATION};
gcloud beta functions deploy ${FUNCTION_NAME} --trigger-http
