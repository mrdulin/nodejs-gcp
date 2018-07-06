const { createTask } = require('./cloudTasks');
const envVars = require('./env');

async function main() {
  try {
    const options = {
      payload: 'hello'
    };
    await createTask(envVars.PROJECT_ID, envVars.location, envVars.queue, options);
  } catch (error) {
    console.error(error);
  }
}

main();
