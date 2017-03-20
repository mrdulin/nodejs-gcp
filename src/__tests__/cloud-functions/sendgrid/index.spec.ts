import dotenv from 'dotenv';
import path from 'path';
import request from 'request-promise';

import { CloudFunctionService } from '../../../gcf';

const dotenvResult = dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

if (dotenvResult.error) {
  throw dotenvResult.error;
}
console.log(dotenvResult.parsed);

const { REGION, PROJECT_ID } = process.env;
const funcName = 'sendEmailBySendgrid';
const cloudFunctionService = new CloudFunctionService({ funcName });

describe('cloud-functions/sendgrid test suites', () => {
  const t1Name = 'should send email successfully';
  it(t1Name, () => {
    const data = {
      subject: t1Name,
      text: t1Name,
      html: `
        <strong>${t1Name}</strong>
      `
    };

    const output: string = cloudFunctionService.invoke(data, false);
    console.log(output);
    expect(output).toContain('{"result":{}}');
  });

  const t2Name = 'should send email successfully when set TO and FROM property to data';
  it(t2Name, () => {
    const data = {
      to: 'novaline.dulin@gmail.com',
      from: 'sendgrid.gcf.test@gmail.com',
      subject: t2Name,
      text: t2Name,
      html: `<strong>${t2Name}</strong>`
    };
    const output: string = cloudFunctionService.invoke(data, false);
    console.log(output);
    expect(output).toContain('{"result":{}}');
  });

  const t3Name = 'should send email successfully and show text when not set html property';
  it(t3Name, () => {
    const data = {
      subject: t3Name,
      text: t3Name
    };
    const output: string = cloudFunctionService.invoke(data, false);
    console.log(output);
    expect(output).toContain('{"result":{}}');
  });

  const t4Name = 'should throw an error when req.method !== "POST"';
  it(t4Name, async () => {
    const data = {
      subject: t4Name,
      test: t4Name
    };
    const url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${funcName}`;
    try {
      await request(url);
    } catch (error) {
      expect(error.statusCode).toEqual(405);
      expect(error.message).toBe('405 - "Only POST requests are accepted"');
    }
  });
});
