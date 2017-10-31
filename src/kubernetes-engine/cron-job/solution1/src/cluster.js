const cluster = require('cluster');
const os = require('os');
const path = require('path');

function createCluster() {
  const cpus = os.cpus();
  cluster.setupMaster({ exec: path.resolve(__dirname, './app.js') });
  for (const _ of cpus) {
    const worker = cluster.fork();
    console.log(`Create worker. pid: ${worker.process.pid}`);
  }

  cluster
    .on('disconnect', (worker) => {
      console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    })
    .on('exit', (worker, code, signal) => {
      console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
      const newWorker = cluster.fork();
      console.log(`CLUSTER: Worker ${newWorker.id} started`);
    });
}

module.exports = { createCluster };
