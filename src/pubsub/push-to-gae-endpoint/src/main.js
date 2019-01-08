const { server } = require('./server');

(async function bootstrap() {
  const { PORT = 3000 } = process.env;
  await server({
    PORT
  });
})();
