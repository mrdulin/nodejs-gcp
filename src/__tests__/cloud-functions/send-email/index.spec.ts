import { logger } from '../../../utils';
import { CloudFunctionService } from '../../../gcf';

const funcName = 'sendEmail';

const cloudFunctionService = new CloudFunctionService({ funcName });

describe('cloud-functions/send-email test suites', () => {
  it('should send email correctly with single reciever set in environment variable', () => {
    const data = {
      subject: 'send email test - 1',
      text: 'send email test - 1'
    };
    const output: string | undefined = cloudFunctionService.invoke(data);
    expect(output).toContain('executionId');
  });

  it('should send email correctly with multiple recievers set in message', () => {
    const data = {
      subject: 'nodemailer test - 2',
      text: 'nodemailer test - 2',
      recievers: ['novaline.dulin@gmail.com', 'novaline@aliyun.com']
    };
    const output: string | undefined = cloudFunctionService.invoke(data);
    expect(output).toContain('executionId');
  });
});
