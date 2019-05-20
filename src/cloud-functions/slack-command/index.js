const rp = require('request-promise');
const vm = require('./vm');

function request(url, text) {
  return rp({
    uri: url,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: {
      response_type: 'in_channel',
      text
    },
    json: true
  }).catch((error) => {
    console.error(error);
    return Promise.reject('Sending delayed responses error');
  });
}

async function operateVM(req, res) {
  // console.log('req.body: ', JSON.stringify(req.body));
  const { command, text, response_url } = req.body;
  if (command !== '/vm') {
    await request(response_url, `unknown command: ${command}`);
    return res.sendStatus(200);
  }
  switch (text) {
    case 'start':
      try {
        await vm.start();
        await vm.waitForRunning();
        await request(response_url, 'VM is running');
      } catch (error) {
        await request(response_url, error.message);
      }
      break;
    case 'stop':
      try {
        await vm.stop();
        await vm.waitForTerminated();
        await request(response_url, 'VM is terminated');
      } catch (error) {
        await request(response_url, error.message);
      }
      break;
    default:
      await request(response_url, `unknown command parameter: ${text}`);
  }

  res.sendStatus(200);
}

exports.operateVM = operateVM;
