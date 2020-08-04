import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function updateSecret() {
  const name = 'projects/shadowsocks-218808/secrets/my-secret';
  const [secret] = await client.updateSecret({
    secret: {
      name,
      labels: {
        secretmanager: 'rocks',
      },
    },
    updateMask: {
      paths: ['labels'],
    },
  });

  console.info(`Updated secret ${secret.name}`);
}

updateSecret().catch(console.log);
