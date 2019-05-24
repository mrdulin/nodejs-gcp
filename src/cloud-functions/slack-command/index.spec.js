// const { operateVM } = require('./');

const express = require('express');
const bodyParser = require('body-parser');
const { operateVM } = require('./demo');

const app = express();
const PORT = '3001';

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.get('/healthy-check', (req, res) => {
  res.sendStatus(200);
});

app.post('/vm', operateVM);

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
