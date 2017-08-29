const express = require('express');
const path = require('path');
const package = require('./package.json');

function createServer() {
  const app = express();
  app.set('views', path.resolve(__dirname, './views'));
  app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/version', (req, res) => {
    res.send(`version: ${package.version}`);
  });

  const PORT = process.env.PORT || 8080;
  return app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
}
