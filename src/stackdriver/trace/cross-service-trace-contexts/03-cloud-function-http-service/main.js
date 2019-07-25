const pkg = require('./package.json');
const tracer = require('@google-cloud/trace-agent').start({
  serviceContext: { service: pkg.name, version: pkg.version }
});
const fetch = require('node-fetch');

exports.TestCloudTraceHttpService = async function HttpService(req, res) {
  console.log(`req.headers: ${JSON.stringify(req.headers, null, 2)}`);
  const traceContext = req.headers['x-cloud-trace-context'];
  const span = tracer.createChildSpan({ name: pkg.name, traceContext });
  span.addLabel('traceContext', traceContext);

  const body = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());

  span.endSpan();
  res.json(body);
};
