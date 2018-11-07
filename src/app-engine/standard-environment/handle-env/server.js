const express = require('express');
const cp = require('child_process');

const package = require('./package.json');

if (process.env.NODE_ENV !== 'production') {
  require('./env');
}
printenv();

const app = express();
const PORT = process.env.PORT || 8080;

function printenv() {
  return ['NODE_ENV', 'PORT'].map((env) => {
    const msg = `process.env.${env}: ${process.env[env]}`;
    console.log(msg);
    return msg;
  });
}

function listNpmPkgs() {
  const command = 'npm list --depth=0';
  return cp.execSync(command).toString();
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/version', (req, res) => {
  res.send(`version: ${package.version}`);
});

app.get('/env', (req, res) => {
  const envs = printenv();
  res.status(200).send(envs);
});

app.get('/npm-list', (req, res) => {
  const result = listNpmPkgs();
  console.log(result);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}...`);
});
