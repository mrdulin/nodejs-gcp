const pkg = require('../package.json');

const config = {
  ENV: process.env.NODE_ENV || 'development',
  EMAIL_TO: process.env.EMAIL_TO || '',
  K8S_POD_NAME: process.env.K8S_POD_NAME || '',
  VERSION: pkg.version,
  SLEEP: Number.parseInt(process.env.SLEEP, 10) || 65 * 1000
};
console.log('config: ', config);

module.exports = config;
