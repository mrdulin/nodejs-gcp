const config = {
  CREATE_USER_SCHEDULER: (process.env.CREATE_USER_SCHEDULER || 5) * 1000,

  PROJECT_ID: 'shadowsocks-218808',

  PUBSUB: {
    CREATE_USER_TOPIC: 'create-user',
    MESSAGE_PROCESS_SUBSCRIPTION: 'message-process'
  }
};

module.exports = { config };
