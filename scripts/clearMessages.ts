import { deleteSubsciption } from '../src/googlePubsub';

async function main() {
  const [topicName, subName] = process.argv.slice(2);
  console.log(topicName, subName);
  await deleteSubsciption(topicName, subName);
}

main();
