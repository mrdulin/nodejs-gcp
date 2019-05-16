import cp from 'child_process';

export type Callback = (err?: Error | undefined | null, result?: any) => void;
export interface IAnyObject {
  [key: string]: any;
}

export interface IRetryMessage {
  retryTimes?: number;
}

export interface IMessage<Body> extends IRetryMessage, IAnyObject {
  type?: string;
  body?: Body;
}

export interface IValidMessage<Body> extends Required<IMessage<Body>> {}

export interface IMessageWithCampaignId<Body> extends IMessage<Body> {
  campaignId?: string;
  agencyCampaignId?: string;
}

export interface IDeadLetterMessage {
  uri: string;
  error: Error;
}

export interface IPubsubEvent {
  data: {
    data: string;
  };
}

export interface IContext {
  eventId: string;
  timestamp: string;
  eventType: string;
  resource: string;
}

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
    let message = this.defaultMessage;
    if (!pubsubMessage.data) {
      console.error(new Error('event.data.data is required. Return default message.'));
      return this.defaultMessage;
    }
    console.log('pubsubMessage: ', pubsubMessage);
    try {
      message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
      console.log('message:', message);
      return message;
    } catch (error) {
      console.error('JSON parse message failed.');
      console.error(error);
    }
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

  public invoke<Body>(message: IMessage<Body>, base64: boolean = true): string {
    if (this.funcName) {
      const jsonString = base64 ? this.serializePubsubEventData(message) : JSON.stringify(message);
      return cp.execSync(`gcloud beta functions call ${this.funcName} --data '${jsonString}'`).toString();
    }
    return '';
  }
}

export { CloudFunctionService, ICloudFunctionServiceOpts };
