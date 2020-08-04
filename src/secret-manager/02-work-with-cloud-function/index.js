const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const secretManagerServiceClient = new SecretManagerServiceClient();
const name = 'projects/shadowsocks-218808/secrets/workflow/versions/latest';

exports.testSecretManager = async (req, res) => {
  const [version] = await secretManagerServiceClient.accessSecretVersion({ name });
  const payload = version.payload.data.toString();
  console.debug(`Payload: ${payload}`);
  res.sendStatus(200);
};
