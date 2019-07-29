const { PubSub } = require('@google-cloud/pubsub');
const fetch = require('node-fetch');

const pubsub = new PubSub();
const GOOGLE_ADWORDS_API = process.env.GOOGLE_ADWORDS_API || '';

exports.createBudget = async function createBudget(data, context, callback) {
  const pubSubMessage = data;
  const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
  const message = JSON.parse(jsonString);
  console.log(`message: ${JSON.stringify(message, null, 2)}`);
  const traceContext = parseContextFromHeader(message.traceContext);
  const budget = await createBudgetHTTPOperation(traceContext);
  console.log('budget: ', budget);
  await pubsub.topic('budgetCreated').publish(Buffer.from(jsonString));
  callback();
};

function generateTraceContext(traceContext) {
  if (!traceContext) {
    return '';
  }
  let header = `${traceContext.traceId}/${traceContext.spanId}`;
  if (typeof traceContext.options !== 'undefined') {
    header += `;o=${traceContext.options}`;
  }
  return header;
}

function parseContextFromHeader(str) {
  if (!str) {
    return null;
  }
  const matches = str.match(/^([0-9a-fA-F]+)(?:\/([0-9]+))(?:;o=(.*))?/);
  if (!matches || matches.length !== 4 || matches[0] !== str || (matches[2] && isNaN(Number(matches[2])))) {
    return null;
  }
  return {
    traceId: matches[1],
    spanId: matches[2],
    options: isNaN(Number(matches[3])) ? undefined : Number(matches[3])
  };
}

function createBudgetHTTPOperation(traceContext) {
  traceContext = generateTraceContext(traceContext);
  const body = { operation: 'create budget' };
  return fetch(GOOGLE_ADWORDS_API, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-cloud-trace-context': traceContext
    }
  }).then((res) => res.json());
}
