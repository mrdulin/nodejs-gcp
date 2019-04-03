const kms = require('@google-cloud/kms');
const dotenv = require('dotenv');
const path = require('path');

const dotenvOutput = dotenv.config({ path: path.resolve(__dirname, './.env') });
if (dotenvOutput.error) {
  throw dotenvOutput.error;
}
console.log('dotenvOutput: ', dotenvOutput.parsed);

const client = new kms.KeyManagementServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const locationId = 'global';

async function createKeyRing(keyRingId) {
  if (!process.env.PROJECT_ID) {
    throw new Error('process.env.PROJECT_ID required');
  }
  const parent = client.locationPath(process.env.PROJECT_ID, locationId);
  try {
    const [result] = await client.createKeyRing({ parent, keyRingId });
    console.log(`key ring ${result.name} created.`);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('create key ring failed.');
  }
}

async function createCryptoKey(keyRingId, cryptoKeyId) {
  const parent = client.keyRingPath(process.env.PROJECT_ID, locationId, keyRingId);
  const [cryptoKey] = await client.createCryptoKey({
    parent,
    cryptoKeyId,
    cryptoKey: {
      purpose: 'ENCRYPT_DECRYPT'
    }
  });
  console.log(`Key ${cryptoKey.name} created`);
  return cryptoKey;
}

async function listKeyRings() {
  const parent = client.locationPath(process.env.PROJECT_ID, locationId);
  try {
    const [result] = await client.listKeyRings({ parent });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('list key rings failed.');
  }
}

module.exports = { createKeyRing, createCryptoKey, listKeyRings };
