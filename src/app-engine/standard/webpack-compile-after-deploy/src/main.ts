import express from 'express';
import pkg from '../package.json';

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
