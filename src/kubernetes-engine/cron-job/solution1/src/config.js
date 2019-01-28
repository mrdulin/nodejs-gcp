const config = {
  PORT: process.env.PORT || 8080,
  ENV: process.env.NODE_ENV || 'development',
  DOTENV_DEBUG: process.env.DOTENV_DEBUG || false,
  EMAIL_TO: process.env.EMAIL_TO || '',
  CLUSTER_MODE: process.env.CLUSTER_MODE || false
};

module.exports = config;
