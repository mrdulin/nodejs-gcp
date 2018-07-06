const { deleteQueue } = require('./cloudTasks');
const envVars = require('./env');

async function main() {
  try {
    await deleteQueue(envVars.PROJECT_ID, envVars.queue, envVars.location);
  } catch (error) {
    console.error(error);
  }
}

main();
