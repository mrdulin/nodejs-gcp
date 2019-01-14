import { pub } from '../../googlePubsub';

const user = { user_id: 1 };
pub('scheduleJob', user);
