import Compute from '@google-cloud/compute';

const compute = new Compute({
  keyFilename: process.env.CREDENTIALS,
  projectId: process.env.PROJECT_ID
});

async function getVms() {
  const options = {
    maxResults: 1
  };
  const vms = await compute.getVMs(options);
  return vms;
}

async function main() {
  const vms = await getVms().catch(console.error);
  console.log('vms: ', vms);
}

main();
