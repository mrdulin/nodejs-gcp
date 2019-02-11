const pkg = require('../package.json');

const config = {
  ENV: process.env.NODE_ENV || 'development',
  K8S_POD_NAME: process.env.K8S_POD_NAME || '',
  VERSION: pkg.version
};
console.log('config: ', config);

module.exports = config;
