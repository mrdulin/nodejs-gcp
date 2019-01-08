import { download } from '../../gcs';

async function main() {
  const bucketName = 'nodejs-gcp';
  const srcFilename = 'mmczblsq.doc';
  await download(bucketName, srcFilename);
}

main();
