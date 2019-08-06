import path from 'path';
(async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    const dotenvConfigOutput = dotenv.config({ path: path.resolve(process.cwd(), './.env') });
    if (dotenvConfigOutput.error) {
      console.error(dotenvConfigOutput.error);
      process.exit(1);
    }
    console.log(`dotenvConfigOutput: ${JSON.stringify(dotenvConfigOutput.parsed, null, 2)}`);
  }
  const traceAgent = await import('@google-cloud/trace-agent');
  traceAgent.start({
    keyFilename: process.env.TRACE_AGENT_CREDENTIAL,
    samplingRate: 5,
    ignoreUrls: [/^\/ignore-me/],
    ignoreMethods: ['options'],
    enhancedDatabaseReporting: true
  });
  const { createServer } = await import('./server');
  await createServer();
})();
