import { createTopic } from '../../googlePubsub';

function main() {
  const topicName: string = 'nestedData';
  createTopic(topicName);
}

main();
