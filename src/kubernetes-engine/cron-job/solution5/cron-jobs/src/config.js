const config = {
  ENV: process.env.NODE_ENV || 'development',
  EMAIL_TO: process.env.EMAIL_TO || '',
  K8S_POD_NAME: process.env.K8S_POD_NAME || ''
};
console.log('config: ', config);

module.exports = config;
