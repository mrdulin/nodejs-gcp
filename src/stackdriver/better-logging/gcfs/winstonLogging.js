const faker = require('faker');

const { user } = require('../data');
const { logger } = require('../logger');

const UserDAO = {
  async findById(id) {
    return new Promise((_, reject) => {
      process.nextTick(() => {
        reject(new Error('something bad happened'));
      });
    });
  }
};

const UserService = {
  async findById(id) {
    try {
      JSON.parse(id);
      return await UserDAO.findById(id);
    } catch (error) {
      throw error;
    }
  }
};

exports.winstonLogging = async (req, res) => {
  // logger.info(JSON.stringify(user), '[log 1]');
  // logger.info(JSON.stringify(user), ['[log 2]']);
  // logger.info(`[log 3] ${JSON.stringify(user)}`);
  // logger.info(JSON.stringify(user, null, 2), '[log 4]');
  // logger.log({ level: 'info', message: JSON.stringify(user), meta: '[log 5]' });

  // better logging
  // logger.log({
  //   level: 'info',
  //   message: JSON.stringify(user, null, 2),
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

  const userId = faker.random.uuid();
  try {
    await UserService.findById(userId);
    logger.info('find user by id success');
    res.sendStatus(200);
  } catch (error) {
    logger.log({
      level: 'error',
      message: error.stack,
      // stack: error.stack,
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
      labels: ['error', 'better logging', 'error stack', 'way 1']
    });

    logger.error(error.stack, {
      // stack: error.stack,
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
      labels: ['error', 'better logging', 'error stack', 'way 2']
    });
    res.sendStatus(500);
  }
};
