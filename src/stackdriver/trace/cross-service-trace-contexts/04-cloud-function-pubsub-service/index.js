const pkg = require('./package.json');
const tracer = require('@google-cloud/trace-agent').start({
  samplingRate: 0,
  bufferSize: 1,
  serviceContext: {
    service: pkg.name,
    version: pkg.version
  }
});
const fetch = require('node-fetch');
const CLOUD_FUNCTION_PUBSUB_SERVICE_URL = process.env.CLOUD_FUNCTION_PUBSUB_SERVICE_URL || '';
console.log('CLOUD_FUNCTION_PUBSUB_SERVICE_URL: ', CLOUD_FUNCTION_PUBSUB_SERVICE_URL);

exports.TestCloudTracePubSubService = async function TestCloudTrace(data, context, callback) {
  tracer.runInRootSpan(
    {
      name: 'TestCloudTracePubSubService', // Your function name here
      traceContext: tracer.propagation.extract((key) => req.headers[key])
    },
    async (rootSpan) => {
      const pubSubMessage = data;
      const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
      const message = JSON.parse(jsonString);
      console.log(`message: ${JSON.stringify(message, null, 2)}`);
      // Your logic here. Just be sure to call endSpan() after sending a response.
      const body = await fetch(CLOUD_FUNCTION_PUBSUB_SERVICE_URL).then((res) => res.json());
      console.log(`body: ${JSON.stringify(body, null, 2)}`);
      callback();
      rootSpan.endSpan();
    }
  );
};
