const MESSAGE_PROCESS_TOPIC = 'message-process';
const MESSAGE_PROCESS_SUBSCRIPTION = 'message-process';

const CREATE_USER_TOPIC = 'create-user';
const CREATE_USER_SUBSCRIPTION = 'create-user';

const config = {
  pubsub: {
    resources: [
      { topic: MESSAGE_PROCESS_TOPIC, sub: MESSAGE_PROCESS_SUBSCRIPTION },
      { topic: CREATE_USER_TOPIC, sub: CREATE_USER_SUBSCRIPTION }
    ]
  }
};

module.exports = { config };
