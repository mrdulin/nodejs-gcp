const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const pkg = require('./package.json');

const jsonParser = bodyParser.json({ limit: '1kb' });
const port = process.env.PORT || 8080;
const createUserLimiter = new rateLimit({
  windowMs: 30 * 1000,
  max: 2,
  message: 'Too many users created from this IP, please try again after 30 seconds'
});

const memoryDB = {
  users: []
};

async function createServer() {
  const app = express();
  app.use(jsonParser);

  app.get('/', (req, res) => {
    res.send(`version: ${pkg.version}`);
  });

  app.post('/create-user', createUserLimiter, (req, res) => {
    const user = req.body;
    memoryDB.users.push(user);
    res.end('create user success.');
  });

  app.get('/users', (req, res) => {
    res.json(memoryDB.users);
  });

  app.get('/clear-db', (req, res) => {
    memoryDB.users = [];
    res.sendStatus(200);
  });

  return app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  createServer();
}

module.exports = { createServer };
