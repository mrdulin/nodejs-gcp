import { sub } from '../../googlePubsub';

sub('scheduleJobSub', (message: any) => {
  console.log('message: ', message);
});
