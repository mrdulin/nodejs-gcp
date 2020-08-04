import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function createSecret() {
  const parent = 'projects/shadowsocks-218808';
  const secretId = 'my-secret';
  const [secret] = await client.createSecret({
    parent,
    secretId,
    secret: {
      replication: {
        automatic: {},
      },
    },
  });
  console.log(`Created secret ${secret.name}`);
}

createSecret().catch(console.log);
