async function main() {
  const { credentials } = await import('../../../credentials');
  // tslint:disable-next-line:no-var-requires
  const tracer = require('@google-cloud/trace-agent').start({
    projectId: credentials.PROJECT_ID,
    keyFilename: credentials.STACKDRIVER_TRACE_ADMIN_CREDENTIAL
  });
  const { createServer } = await import('./server');
  await createServer();
}

main();
