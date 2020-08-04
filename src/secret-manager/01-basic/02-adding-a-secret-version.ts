import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function addSecretVersion() {
  const parent = 'projects/shadowsocks-218808/secrets/my-secret';
  const payload = Buffer.from('my super secret data', 'utf8');
  const [version] = await client.addSecretVersion({
    parent,
    payload: {
      data: payload,
    },
  });
  console.log(`Added secret version ${version.name}`);
}

addSecretVersion().catch(console.log);
