const { createServer } = require('./server');
const config = require('./config');
const { initPubsub } = require('./pubsub');

(async function bootstrap() {
  const opts = {
    PORT: config.PORT,
    VERSION: config.VERSION
  };
  await initPubsub();
  createServer(opts);
})();
