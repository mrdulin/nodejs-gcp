const faker = require('faker');

const user = {
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  address: {
    city: faker.address.city(),
    country: faker.address.country(),
    street: {
      streetPrefix: faker.address.streetPrefix(),
      streetSuffix: faker.address.streetSuffix()
    }
  }
};

module.exports = { user };
