import cp from 'child_process';

import { IPubsubEvent, IMessage, IValidMessage } from './@types';

interface ICloudFunctionServiceOpts {
  funcName: string;
}

class CloudFunctionService {
  private defaultMessage: IMessage<any> = { type: 'DEFAULT', body: {} };
  private funcName: string = '';
  constructor(opts?: ICloudFunctionServiceOpts) {
    if (opts) {
      this.funcName = opts.funcName;
    }
  }
  public parsePubsubEventData<Body>(event: IPubsubEvent): IMessage<Body> {
    const pubsubMessage = event.data;
    if (!pubsubMessage.data) {
      console.error(new Error('event.data.data is required. Return default message.'));
      return this.defaultMessage;
    }
    console.log('pubsubMessage: ', pubsubMessage);
    const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
    console.log('message:', message);
    return message;
  }

  public serializePubsubEventData<Body>(message: IMessage<Body>): string {
    const dataBuffer = Buffer.from(JSON.stringify(message)).toString('base64');
    return JSON.stringify({ data: dataBuffer });
  }

  public validateMessage<Body>(message: IMessage<Body>, type?: string): message is IValidMessage<Body> {
    if (!message) {
      console.error(new Error('message is required'));
      return false;
    }
    if (type) {
      if (!message.type) {
        console.error(new Error('message.type is required'));
        return false;
      }
      if (message.type !== type) {
        return false;
      }
    }

    if (!message.body) {
      console.error(new Error('message.body is required'));
      return false;
    }

    return true;
  }

  public invoke<Body>(message: IMessage<Body>): string | undefined {
    if (this.funcName) {
      const jsonString = this.serializePubsubEventData(message);
      return cp.execSync(`gcloud beta functions call ${this.funcName} --data '${jsonString}'`).toString();
    }
  }
}

export { CloudFunctionService, ICloudFunctionServiceOpts };
