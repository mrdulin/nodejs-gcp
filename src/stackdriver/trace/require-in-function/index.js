const express = require('express');
const app = express();

async function getEnvVars() {
  return {
    keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json'
  };
}

let tracer;
app.get('/', async (req, res) => {
  tracer = require('@google-cloud/trace-agent').get();
  if (!tracer) {
    const envVars = await getEnvVars();
    tracer = require('@google-cloud/trace-agent').start({
      samplingRate: 0,
      bufferSize: 1,
      keyFilename: envVars.keyFilename
    });
  }
  console.log(`tracer: ${JSON.stringify(tracer)}`);

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
