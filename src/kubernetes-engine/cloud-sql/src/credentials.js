if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const credentials = {
  PROJECT_ID: process.env.PROJECT_ID || '',
  SQL_INSTANCE_CONNECTION_NAME: process.env.SQL_INSTANCE_CONNECTION_NAME || '',
  SQL_DATABASE: process.env.SQL_DATABASE || '',
  SQL_USER: process.env.SQL_USER || '',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  SQL_HOST: process.env.SQL_HOST || '127.0.0.1',
  SQL_PORT: process.env.SQL_PORT || '5432'
};

module.exports = credentials;
