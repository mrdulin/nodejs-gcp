import cp from 'child_process';
import faker from 'faker';

const fnName: string = 'nestedData';

describe('cloud-functions/nested-data integration test suites', () => {
  it('should execuate successfully', () => {
    const body = {
      city: faker.address.city(),
      user: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        ips: {
          ip1: faker.internet.ip(),
          ip2: faker.internet.ip()
        }
      }
    };

    const data = {
      type: faker.finance.transactionType(),
      body
    };

    const dataBuffer = Buffer.from(JSON.stringify(data)).toString('base64');
    const message = JSON.stringify({ data: dataBuffer });

    const output: string = cp.execSync(`gcloud beta functions call ${fnName} --data '${message}'`).toString();
    expect(output).toContain('executionId');
  });
});
