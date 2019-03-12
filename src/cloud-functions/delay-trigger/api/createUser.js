const faker = require('faker');

const pubsub = require('./pubsub');

async function main() {
  const count = 3;
  const MESSAGE_PROCESS_TOPIC = 'message-process';

  for (let i = 0; i < count; i++) {
    const user = { id: faker.random.uuid(), name: faker.name.findName(), email: faker.internet.email() };
    await pubsub.publish(MESSAGE_PROCESS_TOPIC, user);
  }
}

main();
