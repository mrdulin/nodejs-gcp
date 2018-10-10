import Pubsub, { Publisher } from '@google-cloud/pubsub';
import path from 'path';

const pubsubClient = Pubsub({
  projectId: 'just-aloe-212502',
  keyFilename: path.resolve(__dirname, '../../../.gcp/just-aloe-212502-4bf05c82cc24.json')
});

const topic = 'batch-multiple-messages';
const sub = 'batch-multiple-messages-sub';

export { pubsubClient, topic, sub };
