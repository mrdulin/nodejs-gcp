async function createTask(project, location, queue, options) {
  const cloudTasks = require('@google-cloud/tasks');
  const client = new cloudTasks.CloudTasksClient();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: '/createUser'
    }
  };

  if (options.payload !== undefined) {
    task.appEngineHttpRequest.body = Buffer.from(options.payload).toString('base64');
  }

  if (options.inSeconds !== undefined) {
    task.scheduleTime = {
      seconds: options.inSeconds + Date.now() / 1000
    };
  }

  const request = {
    parent: parent,
    task: task
  };

  console.log('Sending task %j', task);
  // Send create task request.
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);
}

if (require.main === module) {
  const faker = require('faker');
  const envVars = require('./env');
  function concurrencyTasks(num) {
    for (let i = 0; i < num; i++) {
      const user = { id: faker.random.uuid(), name: faker.name.findName(), email: faker.internet.email() };
      const options = {
        payload: JSON.stringify(user)
      };
      createTask(envVars.PROJECT_ID, envVars.location, envVars.queue, options).catch(console.error);
    }
  }

  concurrencyTasks(5);
}
