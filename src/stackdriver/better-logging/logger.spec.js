const faker = require('faker');
const { logger } = require('./logger');
const { user } = require('./data');

const UserService = {
  findById(id) {
    try {
      UserDAO.findById(id);
    } catch (error) {
      throw error;
    }
  }
};

const UserDAO = {
  findById(id) {
    try {
      JSON.parse('');
    } catch (error) {
      throw error;
    }
  }
};
const userId = faker.random.uuid();

try {
  UserService.findById(userId);
} catch (error) {
  // test 1
  // logger.log({
  //   level: 'error',
  //   message: error,
  //   context: 'UserService.findById',
  //   arguments: {
  //     id: faker.random.uuid(),
  //     extra: {
  //       campaignId: faker.random.uuid(),
  //       location: { id: faker.random.uuid(), latitude: faker.address.latitude(), longitude: faker.address.longitude() }
  //     }
  //   },
  //   labels: ['log 6', 'better logging', 'winston']
  // });
  // test 2
  logger.error(error, {
    context: 'UserService.findById',
    arguments: {
      id: faker.random.uuid(),
      extra: {
        campaignId: faker.random.uuid(),
        location: { id: faker.random.uuid(), latitude: faker.address.latitude(), longitude: faker.address.longitude() }
      }
    },
    labels: ['log 6', 'better logging', 'winston']
  });
}

// logger.log({
//   level: 'info',
//   message: user,
//   context: 'UserService.findById',
// arguments: {
//   id: faker.random.uuid(),
//   extra: {
//     campaignId: faker.random.uuid(),
//     location: { id: faker.random.uuid(), latitude: faker.address.latitude(), longitude: faker.address.longitude() }
//   }
// },
//   labels: ['log 6', 'better logging', 'winston']
// });

logger.info(user, {
  context: 'UserService.findById',
  arguments: {
    id: faker.random.uuid(),
    extra: {
      campaignId: faker.random.uuid(),
      location: { id: faker.random.uuid(), latitude: faker.address.latitude(), longitude: faker.address.longitude() }
    }
  },
  labels: ['log 7', 'better logging', 'winston', 'info']
});

logger.debug(user, {
  context: 'UserService.findById',
  arguments: {
    id: faker.random.uuid(),
    extra: {
      campaignId: faker.random.uuid(),
      location: { id: faker.random.uuid(), latitude: faker.address.latitude(), longitude: faker.address.longitude() }
    }
  },
  labels: ['log 7', 'better logging', 'winston', 'debug']
});
