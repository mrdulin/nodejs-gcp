import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function getSecret() {
  const name = 'projects/shadowsocks-218808/secrets/my-secret';
  const [secret] = await client.getSecret({ name });
  console.info(`Found secret ${secret.name}`);
}

getSecret().catch(console.log);
