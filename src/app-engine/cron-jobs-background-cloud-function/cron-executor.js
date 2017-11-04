const { subscribeClient, createEmailRetrySubName, createEmailTopicName, pubsubClient } = require('./pubsub');
const { getEnvVars } = require('./metadata');

async function getMessages() {
  const projectId = await getEnvVars('project-id', 'projectId');
  console.log('projectId: ', projectId);
  const formattedSubscription = subscribeClient.subscriptionPath(projectId, createEmailRetrySubName);
  const maxMessages = 1;
  const request = {
    subscription: formattedSubscription,
    maxMessages
  };
  try {
    const responses = await subscribeClient.pull(request);
    const response = responses[0];
    if ('receivedMessages' in response) {
      console.debug('number msgs: %s', response.receivedMessages.length);
      return response.receivedMessages;
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
      runTask(pubsubMessage);
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

async function runTask(msg) {
  try {
    await pubsubClient
      .topic(createEmailTopicName)
      .publisher()
      .publish(msg.data);
    console.log('publish message success');
  } catch (error) {
    console.log('publish message error.', error);
  }
}

module.exports = {
  getMessages,
  processMessages
};
