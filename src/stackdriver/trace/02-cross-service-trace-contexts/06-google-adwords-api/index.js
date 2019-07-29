const tracer = require('@google-cloud/trace-agent').start({
  serviceContext: {
    service: 'google adwords APIs'
  }
});
const faker = require('faker');

exports.GoogleAdwordsAPI = function GoogleAdwordsAPI(req, res) {
  const { operation } = req.body;
  console.log('operation: ', operation);
  const traceContext = tracer.propagation.extract((key) => req.headers[key]);
  console.log(`req.headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log('traceContext: ', JSON.stringify(traceContext, null, 2));
  const options = {
    name: operation,
    method: req.method,
    url: req.originalUrl,
    traceContext
  };
  tracer.runInRootSpan(options, async (rootSpan) => {
    // const span = tracer.createChildSpan({ name: operation });
    // const spanTraceContext = span.getTraceContext();
    // console.log('spanTraceContext: ', spanTraceContext);
    const mockdata = await mockRepsonse();
    console.log('mockdata: ', mockdata);
    // span.endSpan();
    rootSpan.endSpan();
    res.json(mockdata);
  });
};

function mockRepsonse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockdata = { email: faker.internet.email() };
      resolve(mockdata);
    }, 1000);
  });
}
