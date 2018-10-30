const { subscribeClient, createEmailRetrySubName, createEmailTopicName, pub } = require('./pubsub');
const { getEnvVars } = require('./metadata');

async function getMessages() {
  const projectId = await getEnvVars('project-id', 'projectId');
  console.log('projectId: ', projectId);
  const formattedSubscription = subscribeClient.subscriptionPath(projectId, createEmailRetrySubName);
  const maxMessages = 1;
  const request = {
    subscription: formattedSubscription,
    maxMessages,
    returnImmediately: true
  };
  try {
    console.log('start to pull message');
    const responses = await subscribeClient.pull(request);
    const response = responses[0];
    if ('receivedMessages' in response) {
      console.debug('number msgs: %s', response.receivedMessages.length);
      return response.receivedMessages;
    } else {
      throw new Error('no message found');
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function processMessages(msgs) {
  const projectId = await getEnvVars('project-id', 'projectId');
  console.log('msgs: ', msgs);
  for (receivedMessage of msgs) {
    console.log('receivedMessage: ', receivedMessage);
    const pubsubMessage = receivedMessage.message;
    console.log('processing: ', receivedMessage.ackId);
    console.log('pubsubMessage: ', pubsubMessage);
    if (pubsubMessage) {
      const ackIds = [];
      const msg = updateRetryTimes(pubsubMessage);
      runTask(msg);
      ackIds.push(receivedMessage.ackId);
      const request = {
        subscription: `projects/${projectId}/subscriptions/${createEmailRetrySubName}`,
        ackIds
      };

      try {
        await subscribeClient.acknowledge(request);
      } catch (error) {
        console.log('subscribeClient acknowledge message error.', error);
      }
    }
  }
}

function parseMessage(msg) {
  if (msg && msg.data) {
    try {
      const json = JSON.parse(Buffer.from(msg.data).toString());
      console.group('====msg====');
      console.log(msg.data);
      console.log(json);
      console.log(typeof json);
      console.groupEnd();
      return json;
    } catch (error) {
      console.error('parse message failed.', error);
      return {};
    }
  } else {
    console.error('parse message failed. please check msg');
  }
}

function updateRetryTimes(msg) {
  const data = parseMessage(msg);
  console.log('updateRetryTimes data:', data);
  if (data) {
    if (typeof data.retryTimes === 'undefined') {
      data.retryTimes = 0;
    }
    console.log(`update msg: ${msg.messageId} retry times`);
    data.retryTimes += 1;
    console.log(`msg: ${msg.messageId} retry times is ${data.retryTimes}`);
    return data;
  } else {
    console.error('update msg retry times failed. msg.data is required');
  }
}

async function runTask(msg) {
  await pub(createEmailTopicName, msg);
}

module.exports = {
  getMessages,
  processMessages
};
