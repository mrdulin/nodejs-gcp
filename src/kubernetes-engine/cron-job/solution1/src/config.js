require('./dotenv');

const config = {
  PORT: process.env.PORT || 8080,
  ENV: process.env.NODE_ENV || 'development',
  DOTENV_DEBUG: process.env.DOTENV_DEBUG || false,
  EMAIL_TO: process.env.EMAIL_TO || ''
};

module.exports = config;
