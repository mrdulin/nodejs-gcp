import express from 'express';
import pkg from '../package.json';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
