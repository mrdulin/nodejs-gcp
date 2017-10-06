import express from 'express';
import pkg from '../package.json';

// tslint:disable-next-line:no-var-requires
require('@google-cloud/debug-agent').start({
  allowExpressions: true,
  capture: { maxFrames: 20, maxProperties: 100 }
});

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);

app.get('/', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
