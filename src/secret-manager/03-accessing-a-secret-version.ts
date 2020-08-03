import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';

const client = new SecretManagerServiceClient({
  keyFile: path.resolve(__dirname, '../../.gcp/secret-manager-admin-svc.json'),
});

async function accessSecretVersion() {
  const name = 'projects/shadowsocks-218808/secrets/my-secret/versions/latest';
  const [version] = await client.accessSecretVersion({ name });
  if (version.payload && version.payload.data) {
    const payload = version.payload.data.toString();
    console.info(`Payload: ${payload}`);
  } else {
    console.log('No payload or data in secret version');
  }
}

accessSecretVersion().catch(console.log);
