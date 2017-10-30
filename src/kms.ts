import kms from '@google-cloud/kms';
import util from 'util';
import fs from 'fs';
import './envVars';

const client: any = new kms.KeyManagementServiceClient({
  keyFilename: process.env.KMS_CRYTOKEY_ENCRYPTER_DECRYPTER_CREDENTIAL
});

async function createKeyRing(keyRingId, locationId) {
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

async function createCryptoKey(keyRingId, cryptoKeyId, locationId) {
  if (!process.env.PROJECT_ID) {
    throw new Error('process.env.PROJECT_ID required');
  }
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

async function listKeyRings(locationId) {
  if (!process.env.PROJECT_ID) {
    throw new Error('project id required');
  }
  const parent = client.locationPath(process.env.PROJECT_ID, locationId);
  try {
    const [result] = await client.listKeyRings({ parent });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('list key rings failed.');
  }
}

async function encrypt(options) {
  const { plaintextFileName, ciphertextFileName, locationId, keyRingId, cryptoKeyId } = options;
  const readFile = util.promisify(fs.readFile);
  let contentsBuffer;
  try {
    contentsBuffer = await readFile(plaintextFileName);
  } catch (error) {
    console.error(error);
    throw new Error('read plaintextFileName failed.');
  }
  const plaintext = contentsBuffer.toString('base64');
  if (!process.env.PROJECT_ID) {
    throw new Error('project id required');
  }
  const name = client.cryptoKeyPath(process.env.PROJECT_ID, locationId, keyRingId, cryptoKeyId);

  // Encrypts the file using the specified crypto key
  let result;
  try {
    const response = await client.encrypt({ name, plaintext });
    result = response[0];
    console.log(`Encrypted ${plaintextFileName} using ${result.name} successfully.`);
  } catch (error) {
    console.error(error);
    throw new Error('encrypt failed.');
  }
  const writeFile = util.promisify(fs.writeFile);
  try {
    await writeFile(ciphertextFileName, Buffer.from(result.ciphertext, 'base64'));
    console.log(`Result saved to ${ciphertextFileName} successfully.`);
  } catch (error) {
    console.error(error);
    throw new Error(`Result saved to ${ciphertextFileName} failed.`);
  }
}

async function decrypt(options) {
  const { ciphertextFileName, plaintextFileName, locationId, keyRingId, cryptoKeyId } = options;
  const readFile = util.promisify(fs.readFile);
  let contentsBuffer;
  try {
    contentsBuffer = await readFile(ciphertextFileName);
  } catch (error) {
    console.error(error);
    throw new Error('read ciphertextFileName failed.');
  }

  const ciphertext = contentsBuffer.toString('base64');
  if (!process.env.PROJECT_ID) {
    throw new Error('project id required');
  }
  const name = client.cryptoKeyPath(process.env.PROJECT_ID, locationId, keyRingId, cryptoKeyId);

  let result;
  try {
    const response = await client.decrypt({ name, ciphertext });
    result = response[0];
  } catch (error) {
    console.error(error);
    throw new Error('decrypt failed.');
  }

  const writeFile = util.promisify(fs.writeFile);
  try {
    await writeFile(plaintextFileName, Buffer.from(result.plaintext, 'base64'));
    console.log(`Result saved to ${plaintextFileName} successfully.`);
  } catch (error) {
    console.error(error);
    throw new Error(`Result saved to ${plaintextFileName} failed.`);
  }
}

export { encrypt, decrypt, createKeyRing, createCryptoKey, listKeyRings };
