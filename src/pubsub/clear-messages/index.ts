import { clearAllMessages } from '../../googlePubsub';

function main() {
  const topicName = 'deadletter';
  const subscriptionName = 'deadletter-sub';
  clearAllMessages(topicName, subscriptionName);
}

main();
