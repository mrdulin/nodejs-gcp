(async function main() {
  const pkg = await import('../package.json');
  const traceAgent = await import('@google-cloud/trace-agent');
  traceAgent.start({
    keyFilename: process.env.TRACE_AGENT_CREDENTIAL,
    samplingRate: 5,
    ignoreUrls: [/^\/ignore-me/],
    ignoreMethods: ['options'],
    serviceContext: {
      service: pkg.name,
      version: pkg.version
    }
  });
  const { createServer } = await import('./server');
  await createServer();
})();
