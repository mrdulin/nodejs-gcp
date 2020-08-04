import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function deleteSecret() {
  const name = 'projects/shadowsocks-218808/secrets/my-secret';
  await client.deleteSecret({ name });
  console.log(`Deleted secret ${name}`);
}

deleteSecret().catch(console.log);
