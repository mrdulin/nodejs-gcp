const pkg = require('../package.json');

const config = {
  PORT: process.env.PORT || 8080,
  VERSION: pkg.version,
  ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;
