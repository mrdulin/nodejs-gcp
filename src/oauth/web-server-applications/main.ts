import { bootstrap } from './app';
import { credentials } from './credential';
import { ICredentials, IApplicationOptions } from './types';

async function main() {
  const options: IApplicationOptions & ICredentials = {
    PORT: 8080,
    CLIENT_ID: credentials.CLIENT_ID,
    CLIENT_SECRET: credentials.CLIENT_SECRET,
    REDIRECT_URL: credentials.REDIRECT_URL
  };
  await bootstrap(options);
}

main();
