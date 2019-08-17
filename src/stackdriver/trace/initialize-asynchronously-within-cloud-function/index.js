const fetch = require('node-fetch');

let tracer;

async function getEnvs() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(process.env);
    }, 1000)
  );
}

async function TestCloudTraceInitializeWithinCloudFunction(data, context, callback) {
  const pubSubMessage = data;
  const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
  const message = JSON.parse(jsonString);
  const envs = await getEnvs();
  console.log(`envs: ${JSON.stringify(envs)}`);

  if (!tracer) {
    tracer = require('@google-cloud/trace-agent').start({
      samplingRate: 0,
      bufferSize: 1,
      serviceContext: { service: 'TestCloudTraceInitializeWithinCloudFunction' }
    });
  }

  tracer.runInRootSpan(
    {
      name: TestCloudTraceInitializeWithinCloudFunction.name,
      traceContext: message.traceContext
    },
    async (rootSpan) => {
      rootSpan.addLabel('message', message);
      rootSpan.addLabel('context', context);
      rootSpan.addLabel('traceContext', message.traceContext);

      const body = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
      console.log(`body: ${JSON.stringify(body)}`);

      rootSpan.endSpan();
      callback();
    }
  );
}

exports.TestCloudTraceInitializeWithinCloudFunction = TestCloudTraceInitializeWithinCloudFunction;
