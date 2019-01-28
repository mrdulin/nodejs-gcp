require('./dotenv');
(function bootstrap() {
  const config = require('./config');
  const credentials = require('./credentials');
  printenv(config, credentials);

  if (config.CLUSTER_MODE === 'true') {
    const { createCluster } = require('./cluster');
    createCluster();
  } else {
    require('./app');
  }
})();

function printenv(config, credentials) {
  console.log('config: ', config);
  console.log('credentials: ', credentials);
}
