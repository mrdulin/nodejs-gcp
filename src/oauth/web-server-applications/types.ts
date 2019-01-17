interface IApplicationOptions {
  PORT: string | number;
}

interface ICredentials {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URL: string;
}

export { IApplicationOptions, ICredentials };
