export type Callback = (err?: Error | undefined | null, result?: any) => void;

export interface IMessage<Body> extends Object {
  retryTimes?: number;
  type?: string;
  body?: Body;
  [key: string]: any;
}

export interface IValidMessage<Body> {
  retryTimes?: number;
  type: string;
  body: Body;
  [key: string]: any;
}

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
