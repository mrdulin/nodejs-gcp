const credentials = {
  PROJECT_ID: process.env.PROJECT_ID || '',
  SQL_INSTANCE_CONNECTION_NAME: process.env.SQL_INSTANCE_CONNECTION_NAME || '',
  SQL_DATABASE: process.env.SQL_DATABASE || '',
  SQL_USER: process.env.SQL_USER || '',
  SQL_PASSWORD: process.env.SQL_PASSWORD || ''
};

module.exports = credentials;
