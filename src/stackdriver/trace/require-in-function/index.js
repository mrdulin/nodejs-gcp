const express = require('express');
const fetch = require('node-fetch');
const app = express();

async function getEnvVars() {
  return {
    keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json'
  };
}

async function asyncOperation() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

let tracer;
app.get('/', async (req, res) => {
  console.count('Test cloud trace initialize within a function');
  tracer = require('@google-cloud/trace-agent').get();
  if (!tracer) {
    const envVars = await getEnvVars();
    tracer = require('@google-cloud/trace-agent').start({
      samplingRate: 0,
      bufferSize: 1,
      keyFilename: envVars.keyFilename
    });
  }
  await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
  await asyncOperation();

  tracer.runInRootSpan(
    {
      name: 'require-in-function'
    },
    (rootSpan) => {
      res.sendStatus(200);
      rootSpan.endSpan();
    }
  );
});

app.listen(8080, () => {
  console.info('server is listening on http://localhost:8080');
});
