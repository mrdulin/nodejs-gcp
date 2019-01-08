const express = require('express');
const package = require('./package.json');

(function bootstrap() {
  const app = express();

  app.get('/version', (req, res) => {
    res.send(`version:${package.version}`);
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
})();
