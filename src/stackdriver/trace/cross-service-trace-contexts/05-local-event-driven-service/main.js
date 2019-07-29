const pkg = require('./package.json');
const serviceContext = {
  service: pkg.name,
  version: pkg.version
};
const tracer = require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/pubsub-admin.json'
});
const fetch = require('node-fetch');
const topicName = 'TestCloudTrace';
const subscriptionName = 'TestCloudTrace';

(function main() {
  console.log(`start ${serviceContext.service}`);
  const subscription = pubsub.topic(topicName).subscription(subscriptionName);

  subscription.on('message', async (message) => {
    const span = tracer.createChildSpan({ name: serviceContext.service });
    const jsonString = Buffer.from(message.data, 'base64').toString();
    const data = JSON.parse(jsonString);
    console.log(`message.data: ${JSON.stringify(data, null, 2)}`);
    console.log(`message.attributes: ${JSON.stringify(message.attributes, null, 2)}`);

    const service2URL = 'http://localhost:3001';
    const body = await fetch(service2URL, {
      method: 'get',
      headers: {
        'x-cloud-trace-context': data.traceContext
      }
    }).then((res) => res.json());
    console.log(`body: ${JSON.stringify(body, null, 2)}`);
    message.ack();
    span.endSpan();
  });

  subscription.on('error', (error) => {
    console.log(error);
  });
})();
