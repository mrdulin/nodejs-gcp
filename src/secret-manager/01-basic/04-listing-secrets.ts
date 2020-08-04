import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function listSecrets() {
  const parent = 'projects/shadowsocks-218808';
  const [secrets] = await client.listSecrets({ parent });
  secrets.forEach((secret) => {
    console.log(secret.name, secret.labels);
  });
}

listSecrets().catch(console.log);
