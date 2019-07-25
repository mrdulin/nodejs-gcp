const pkg = require('./package.json');
const tracer = require('@google-cloud/trace-agent').start({
  serviceContext: {
    service: pkg.name,
    version: pkg.version
  }
});
const fetch = require('node-fetch');
const CLOUD_FUNCTION_PUBSUB_SERVICE_URL = process.env.CLOUD_FUNCTION_PUBSUB_SERVICE_URL || '';
console.log('CLOUD_FUNCTION_PUBSUB_SERVICE_URL: ', CLOUD_FUNCTION_PUBSUB_SERVICE_URL);

exports.TestCloudTracePubSubService = async function TestCloudTrace(data, context) {
  const pubSubMessage = data;
  const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
  const message = JSON.parse(jsonString);
  const span = tracer.createChildSpan({ name: pkg.name, traceContext: message.traceContext });
  span.addLabel('traceContext', message.traceContext);
  console.log(`message: ${JSON.stringify(message, null, 2)}`);

  const body = await fetch(CLOUD_FUNCTION_PUBSUB_SERVICE_URL).then((res) => res.json());
  console.log(`body: ${JSON.stringify(body, null, 2)}`);

  span.endSpan();
};
