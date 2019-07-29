const tracer = require('@google-cloud/trace-agent').start({
  samplingRate: 0,
  bufferSize: 1,
  serviceContext: { service: 'TestCloudTraceHttpService' }
});
const fetch = require('node-fetch');

exports.TestCloudTraceHttpService = function HttpService(req, res) {
  const traceContext = tracer.propagation.extract((key) => req.headers[key]);
  console.log(`req.headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log('traceContext: ', JSON.stringify(traceContext, null, 2));
  const options = {
    name: 'TestCloudTraceHttpService', // Your function name here
    traceContext
  };
  tracer.runInRootSpan(options, async (rootSpan) => {
    // Your logic here. Just be sure to call endSpan() after sending a response.
    const fetchChildSpan = tracer.createChildSpan({ name: 'fetch data from itbook store' });
    const fetchChildSpanTraceContext = fetchChildSpan.getTraceContext();
    console.log('fetchChildSpanTraceContext: ', JSON.stringify(fetchChildSpanTraceContext, null, 2));
    const body = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
    fetchChildSpan.endSpan();
    rootSpan.endSpan();
    res.json(body);
  });
};
