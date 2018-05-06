import './envVars';

const credentials = {
  REGION: process.env.REGION || '',
  PROJECT_ID: process.env.PROJECT_ID || '',
  SQL_INSTANCE_CONNECTION_NAME: process.env.SQL_INSTANCE_CONNECTION_NAME || '',
  SQL_DATABASE: process.env.SQL_DATABASE || '',
  SQL_USER: process.env.SQL_USER || '',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  SQL_SSL: process.env.SQL_SSL || false,
  KMS_CRYTOKEY_ENCRYPTER_DECRYPTER_CREDENTIAL: process.env.KMS_CRYTOKEY_ENCRYPTER_DECRYPTER_CREDENTIAL || '',
  PUBSUB_ADMIN_CREDENTIAL: process.env.PUBSUB_ADMIN_CREDENTIAL || '',
  STACKDRIVER_TRACE_ADMIN_CREDENTIAL: process.env.STACKDRIVER_TRACE_ADMIN_CREDENTIAL || ''
};

export { credentials };
