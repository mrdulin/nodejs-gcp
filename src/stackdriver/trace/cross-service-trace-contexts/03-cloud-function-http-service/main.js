const pkg = require('./package.json');
const tracer = require('@google-cloud/trace-agent').start({
  samplingRate: 0,
  bufferSize: 1,
  serviceContext: { service: pkg.name, version: pkg.version }
});
const fetch = require('node-fetch');

exports.TestCloudTraceHttpService = async function HttpService(req, res) {
  console.log(`req.headers: ${JSON.stringify(req.headers, null, 2)}`);
  tracer.runInRootSpan(
    {
      name: 'TestCloudTraceHttpService', // Your function name here
      traceContext: tracer.propagation.extract((key) => req.headers[key])
    },
    async (rootSpan) => {
      // Your logic here. Just be sure to call endSpan() after sending a response.
      const body = await fetch('https://api.itbook.store/1.0/search/mongodb').then((res) => res.json());
      res.json(body);
      rootSpan.endSpan();
    }
  );
};
