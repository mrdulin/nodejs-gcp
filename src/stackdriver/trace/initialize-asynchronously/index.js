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

function isTracerEnabled() {
  try {
    const config = tracer.getConfig();
    return config.enabled;
  } catch (e) {
    return false;
  }
}

let tracer;
app.get('/', async (req, res) => {
  console.count('Test cloud trace initialize within a function');
  tracer = require('@google-cloud/trace-agent').get();
  // https://github.com/googleapis/cloud-trace-nodejs/issues/1098#issuecomment-521084534
  if (!isTracerEnabled()) {
    const envVars = await getEnvVars();
    tracer = require('@google-cloud/trace-agent').start({
      samplingRate: 0,
      bufferSize: 1,
      keyFilename: envVars.keyFilename
    });
  }

  tracer.runInRootSpan(
    {
      name: 'require-in-function'
    },
    async (rootSpan) => {
      await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
      await asyncOperation();

      res.sendStatus(200);
      rootSpan.endSpan();
    }
  );
});

app.listen(8080, () => {
  console.info('server is listening on http://localhost:8080');
});
