const faker = require('faker');

const aLog = {
  context: 'UserService.findById',
  arguments: {
    id: faker.random.uuid(),
    extra: {
      campaignId: faker.random.uuid(),
      location: {
        id: faker.random.uuid(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
      }
    }
  },
  labels: ['UserService', 'bad logging', 'info']
};

console.log(aLog);
