const { createServer } = require('./server');
const config = require('./config');
const credentials = require('./credentials');
const { seed } = require('./database/seed');

(async function main() {
  console.log('config: ', config);
  console.log('credentials: ', credentials);
  await seed();
  await createServer();
})();
