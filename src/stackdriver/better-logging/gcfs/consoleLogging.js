const { user } = require('../data');

exports.consoleLogging = async (req, res) => {
  console.log('[log 1] user: ', user);
  console.log(`[log 2] user: ${user}`);
  console.log('[log 3] user: %o', user);
  console.log(`[log 4] user: ${JSON.stringify(user)}`);
  console.log('[log 5] user');
  console.log(user);
  console.log('[log 6] user: \n ', user);
  console.log('[log 7] user: %s', JSON.stringify(user));
  console.log(`[log 8] user: ${JSON.stringify(user, null, 2)}`);
  console.log(`[log 9] user:\n${JSON.stringify(user, null, 2)}`);
  console.log('[log 10] user');
  console.log(JSON.stringify(user, null, 2));

  try {
    await findById();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

function findById() {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      reject(new Error('something bad happened'));
    });
  });
}
