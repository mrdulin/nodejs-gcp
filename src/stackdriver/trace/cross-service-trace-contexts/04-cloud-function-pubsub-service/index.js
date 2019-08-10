tracer = require('@google-cloud/trace-agent').start({
  samplingRate: 0,
  bufferSize: 1,
  serviceContext: { service: 'TestCloudTracePubSubService' }
});
const fetch = require('node-fetch');
const CLOUD_FUNCTION_HTTP_SERVICE_URL = process.env.CLOUD_FUNCTION_HTTP_SERVICE_URL || '';
console.log('CLOUD_FUNCTION_HTTP_SERVICE_URL: ', CLOUD_FUNCTION_HTTP_SERVICE_URL);

// exports.TestCloudTracePubSubService = function TestCloudTrace(data, context, callback) {
//   const pubSubMessage = data;
//   const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
//   const message = JSON.parse(jsonString);
//   console.log(`message: ${JSON.stringify(message, null, 2)}`);
//   const traceContext = parseContextFromHeader(message.traceContext);

//   tracer.runInRootSpan(
//     {
//       name: 'TestCloudTracePubSubService', // Your function name here
//       traceContext
//     },
//     async (rootSpan) => {
//       // Your logic here. Just be sure to call endSpan() after sending a response.
//       const fetchChildSpan = tracer.createChildSpan({ name: 'fetch data from http cloud function' });
//       const fetchChildSpanTraceContext = fetchChildSpan.getTraceContext();
//       console.log('fetchChildSpanTraceContext: ', fetchChildSpanTraceContext);
//       const body = await fetch(CLOUD_FUNCTION_HTTP_SERVICE_URL, {
//         headers: {
//           // [tracer.constants.TRACE_CONTEXT_HEADER_NAME]: message.traceContext
//           'x-cloud-trace-context': message.traceContext
//         }
//       }).then((res) => res.json());
//       console.log(`body: ${JSON.stringify(body, null, 2)}`);
//       fetchChildSpan.endSpan();
//       callback();
//     }
//   );
// };

async function TestCloudTrace(data, context, callback) {
  console.log('test trace enhance');
  const pubSubMessage = data;
  const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
  const message = JSON.parse(jsonString);
  const traceContext = generateTraceContext(message.traceContext);
  console.log('traceContext: ', traceContext);
  const body = await fetch(CLOUD_FUNCTION_HTTP_SERVICE_URL, {
    headers: {
      'x-cloud-trace-context': traceContext
    }
  }).then((res) => res.json());
  console.log(`body: ${JSON.stringify(body, null, 2)}`);
  callback();
}

exports.TestCloudTracePubSubService = traceEnhance(TestCloudTrace);

function traceEnhance(cloudfunction) {
  return async function originalCloudFunction(data, context, callback) {
    const pubSubMessage = data;
    const jsonString = pubSubMessage.data ? Buffer.from(pubSubMessage.data, 'base64').toString() : '{}';
    const message = JSON.parse(jsonString);
    console.log(`message: ${JSON.stringify(message, null, 2)}`);

    // can't generate rootSpan
    // let tracer = require('@google-cloud/trace-agent').get();
    // if (!tracer) {
    //   tracer = require('@google-cloud/trace-agent').start({
    //     samplingRate: 0,
    //     bufferSize: 1,
    //     serviceContext: { service: 'TestCloudTracePubSubService' }
    //   });
    // }

    tracer.runInRootSpan(
      {
        name: cloudfunction.name,
        traceContext: message.traceContext
      },
      (rootSpan) => {
        rootSpan.addLabel('message', message);
        rootSpan.addLabel('context', context);
        rootSpan.addLabel('traceContext', message.traceContext);
        function wrappedCallback(...args) {
          rootSpan.endSpan();
          console.log('trace root span end');
          callback.apply(this, args);
        }
        cloudfunction = tracer.wrap(cloudfunction);
        cloudfunction.call(this, data, context, wrappedCallback);
      }
    );
  };
}

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
