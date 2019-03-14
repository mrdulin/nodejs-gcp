const faker = require('faker');

const pubsub = require('./pubsub');

async function main() {
  const count = 3;
  const CREATE_USER_TOPIC = 'create-user';

  for (let i = 0; i < count; i++) {
    const user = { id: faker.random.uuid(), name: faker.name.findName(), email: faker.internet.email() };
    pubsub.publish(CREATE_USER_TOPIC, user);
  }
}

main();
