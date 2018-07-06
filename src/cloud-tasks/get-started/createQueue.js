const { createQueue } = require('./cloudTasks');
const envVars = require('./env');

async function main() {
  try {
    await createQueue(envVars.PROJECT_ID, envVars.queue, envVars.location, envVars.service);
  } catch (error) {
    console.error(error);
  }
}

main();
