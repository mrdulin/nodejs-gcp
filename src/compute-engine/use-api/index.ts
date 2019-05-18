import Compute from '@google-cloud/compute';

const compute = new Compute({
  keyFilename: '/Users/elsa/workspace/github.com/mrdulin/nodejs-gcp/.gcp/gce-editor.json',
  projectId: 'shadowsocks-218808'
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
