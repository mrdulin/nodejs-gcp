const serviceContext = {
  service: 'TestExpressService'
};
const tracerAgent = require('@google-cloud/trace-agent');
const tracer = tracerAgent.start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json',
  serviceContext
});

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3001;
const CLOUD_FUNCTION_URL = 'https://us-central1-shadowsocks-218808.cloudfunctions.net/TestTraceAgent';

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

app.get('/', async (req, res) => {
  const rootSpan = tracer.getCurrentRootSpan();
  const rootSpanTraceContext = rootSpan.getTraceContext();
  console.log('rootSpanTraceContext: ', JSON.stringify(rootSpanTraceContext, null, 2));

  const fetchChildSpan = tracer.createChildSpan({ name: 'fetch' });
  const fetchChildSpanTraceContext = fetchChildSpan.getTraceContext();
  console.log('fetchChildSpanTraceContext: ', JSON.stringify(fetchChildSpanTraceContext, null, 2));
  const body = await fetch(CLOUD_FUNCTION_URL, {
    // headers: {
    //   [tracer.constants.TRACE_CONTEXT_HEADER_NAME]: generateTraceContext(rootSpanTraceContext)
    // }
  }).then((res) => res.json());

  fetchChildSpan.endSpan();
  res.json(body);
});

app.listen(port, () => {
  console.log(`${serviceContext.service} server is listening on http://localhost:${port}`);
});
