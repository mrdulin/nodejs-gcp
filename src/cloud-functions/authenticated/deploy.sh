FUNCTION_NAME='helloHttp'

gcloud beta functions deploy ${FUNCTION_NAME} --trigger-http --runtime nodejs10 \
 # --allow-unauthenticated