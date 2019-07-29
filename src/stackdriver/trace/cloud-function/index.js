const tracer = require('@google-cloud/trace-agent').start({
  // Settings recommended for Cloud Functions.
  samplingRate: 0,
  bufferSize: 1,
  serviceContext: {
    service: 'TestTraceAgentHTTPCloudFunction'
  }
});
const fetch = require('node-fetch');
const url = require('url');

exports.TestTraceAgent = function TestTraceAgent(req, res) {
  console.log('req.headers', JSON.stringify(req.headers, null, 2));
  const traceContext = tracer.propagation.extract((key) => req.headers[key]);
  console.log(`traceContext = ${JSON.stringify(traceContext, null, 2)}`);

  const options = {
    name: 'TestTraceAgent',
    url: req.originalUrl,
    method: req.method,
    traceContext
  };
  tracer.runInRootSpan(options, async (rootSpan) => {
    const responseTraceContext = tracer.getResponseTraceContext(options.traceContext, tracer.isRealSpan(rootSpan));
    console.log('responseTraceContext: ', JSON.stringify(responseTraceContext, null, 2));
    // Your logic here. Just be sure to call endSpan() after sending a response.
    const fetchMongodbBookChildSpan = tracer.createChildSpan({ name: 'fetch mongodb book' });
    const fetchMongodbBookChildSpanTraceContext = fetchMongodbBookChildSpan.getTraceContext();
    console.log(
      'fetchMongodbBookChildSpanTraceContext: ',
      JSON.stringify(fetchMongodbBookChildSpanTraceContext, null, 2)
    );
    const mongodbBookResponseBody = await fetch('https://api.itbook.store/1.0/search/mongodb')
      .then((res) => res.json())
      .catch(console.error);
    fetchMongodbBookChildSpan.endSpan();

    const fetchJavaBookChildSpan = tracer.createChildSpan({ name: 'fetch java book' });
    const fetchJavaBookChildSpanTraceContext = fetchJavaBookChildSpan.getTraceContext();
    console.log(`fetchJavaBookChildSpanTraceContext: ${JSON.stringify(fetchJavaBookChildSpanTraceContext, null, 2)}`);
    const javaBookResponseBody = await fetch('https://api.itbook.store/1.0/search/java')
      .then((res) => res.json())
      .catch(console.error);
    fetchJavaBookChildSpan.endSpan();

    res.json(javaBookResponseBody);
    rootSpan.endSpan();
  });
};
