import Pubsub, { Publisher, GCloudConfiguration } from '@google-cloud/pubsub';
import { logger, genBufferMessage } from './utils';
import './envVars';

const options: GCloudConfiguration = {} || {
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.PUBSUB_ADMIN_CREDENTIAL
};
const pubsubClient: Pubsub.PubSub = Pubsub(options);
const subscriberClient = new (Pubsub.v1 as any).SubscriberClient(options);

async function createTopic(topicName: string): Promise<any> {
  const topicInstance = pubsubClient.topic(topicName);
  const [exists] = await topicInstance.exists();
  if (exists) {
    logger.info(`${topicName} topic is existed`);
    return;
  }
  return pubsubClient
    .createTopic(topicName)
    .then((data) => {
      logger.info(`Create topic ${topicName} successfully`);
      return data;
    })
    .catch((err) => logger.error(err));
}

async function createSubscription(topicName: string, subName: string, verbose: boolean = true) {
  return pubsubClient
    .createSubscription(topicName, subName)
    .then(() => {
      if (verbose) {
        logger.info(`Create subscription:${subName} for topic:${topicName} successfully`);
      }
    })
    .catch((err) => {
      if (verbose) {
        logger.error(`Create subscription:${subName} for topic:${topicName} failed. ${err}`);
      }
    });
}

async function deleteSubsciption(topicName: string, subName: string, verbose: boolean = true) {
  return pubsubClient
    .subscription(subName)
    .delete()
    .then(() => {
      if (verbose) {
        logger.info(`Delete subscription:${subName} for topic:${topicName} successfully`);
      }
    })
    .catch((err) => {
      if (verbose) {
        logger.error(`Delete subscription:${subName} for topic:${topicName} failed. ${err}`);
      }
    });
}

async function clearAllMessages(topicName: string, subName: string) {
  await deleteSubsciption(topicName, subName, false);
  await createSubscription(topicName, subName, false);
  logger.info(`Clear all messages of topic:${topicName} successfully`);
}

async function pub(topicName: string, message: any, attributes?: Publisher.Attributes) {
  const buf: Buffer = genBufferMessage(message);
  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(buf, attributes)
    .then((messageId) => {
      logger.info(`Message was published with ID: ${messageId}`);
    });
}

async function sub(subscriptionName: string, handler: (message: any) => void) {
  const subscription = pubsubClient.subscription(subscriptionName);
  subscription.on('message', handler);
  subscription.on('error', (error) => {
    logger.error('subscription error');
    logger.error(error);
  });
}

async function getProjectId() {
  return new Promise((resolve, reject) => {
    subscriberClient.getProjectId((err, projectId) => {
      if (err) {
        return reject(err);
      }
      resolve(projectId);
    });
  });
}

async function pullMessages(subName: string, maxMessages: number) {
  const projectId = await getProjectId();
  if (!projectId) {
    logger.error('projectId is required');
  }
  const request = {
    subscription: `projects/${projectId}/subscriptions/${subName}`,
    maxMessages,
    returnImmediately: true
  };

  return subscriberClient
    .pull(request)
    .then((responses) => {
      const response = responses[0];
      let messages = [];
      if (response.receivedMessages) {
        messages = response.receivedMessages.map(({ ackId, message }) => {
          const dataBase64 = message.data ? message.data : message;
          const dataString = Buffer.from(dataBase64, 'base64').toString();
          try {
            message.data = JSON.parse(dataString);
          } catch (error) {
            message.data = dataString;
          }
          message.ackId = ackId;
          return message;
        });
      }
      return JSON.stringify(messages, null, 2);
    })
    .catch((err) => {
      logger.error(err);
    });
}

export {
  createTopic,
  createSubscription,
  deleteSubsciption,
  clearAllMessages,
  pubsubClient,
  pub,
  sub,
  subscriberClient,
  pullMessages
};
