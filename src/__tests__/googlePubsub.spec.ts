import { subscriberClient } from '../../src/googlePubsub';

describe('googlePubsub test suites', () => {
  describe('subscriberClient test suites', () => {
    it('should get projectId correctly', (done) => {
      subscriberClient.getProjectId((err, projectId) => {
        console.log(projectId);
        done();
      });
    });
  });
});
