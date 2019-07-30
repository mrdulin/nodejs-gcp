// tslint:disable-next-line:no-var-requires
require('@google-cloud/trace-agent').start({
  keyFilename: '/Users/ldu020/workspace/github.com/mrdulin/nodejs-gcp/.gcp/stackdriver-trace-admin.json'
});

import { createServer } from './server';

async function main() {
  await createServer();
}

main();
