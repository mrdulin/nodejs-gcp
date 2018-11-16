FUNCTION_NAME='retrieveComputeMetadata'

gcloud config configurations activate me
gcloud beta functions deploy ${FUNCTION_NAME} --runtime nodejs8 --trigger-http --memory 128MB