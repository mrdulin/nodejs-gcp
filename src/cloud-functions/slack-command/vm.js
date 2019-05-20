const Compute = require('@google-cloud/compute');

const compute = new Compute({
  keyFilename: process.env.CREDENTIALS,
  projectId: process.env.PROJECT_ID
});

const zone = compute.zone('asia-northeast1-b');
const vm = zone.vm('ssr');

async function getVms() {
  const options = {
    maxResults: 1
  };
  const vms = await compute.getVMs(options);
  return vms;
}

async function start() {
  return vm
    .start()
    .then((data) => {
      const operation = data[0];
      const apiResponse = data[1];
      return apiResponse;
    })
    .catch((error) => {
      console.error('start vm error');
      return Promise.reject(error);
    });
}

async function stop() {
  return vm
    .stop()
    .then((data) => {
      const operation = data[0];
      const apiResponse = data[1];
      return apiResponse;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(new Error('stop vm error'));
    });
}

async function waitForRunning() {
  const options = {
    timeout: 30
  };
  return vm
    .waitFor('RUNNING', options)
    .then((data) => data[0])
    .catch((error) => {
      console.log(error);
      return Promise.reject(new Error('wait for vm running error'));
    });
}

async function waitForStopping() {
  const options = {
    timeout: 30
  };
  return vm
    .waitFor('STOPPING', options)
    .then((data) => data[0])
    .catch((error) => {
      console.log(error);
      return Promise.reject(new Error('wait for vm stopping error'));
    });
}

async function waitForTerminated() {
  const options = {
    timeout: 30
  };
  return vm
    .waitFor('TERMINATED', options)
    .then((data) => data[0])
    .catch((error) => {
      console.log(error);
      return Promise.reject(new Error('wait for vm terminated error'));
    });
}

module.exports = { start, stop, getVms, waitForRunning, waitForStopping, waitForTerminated };
