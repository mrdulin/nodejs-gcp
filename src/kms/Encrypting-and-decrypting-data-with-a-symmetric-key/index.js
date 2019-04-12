const kms = require('@google-cloud/kms');
const dotenv = require('dotenv');
const path = require('path');
const util = require('util');
const fs = require('fs');

const dotenvOutput = dotenv.config({ path: path.resolve(__dirname, './.env') });
if (dotenvOutput.error) {
  throw dotenvOutput.error;
}
console.log('dotenvOutput: ', dotenvOutput.parsed);

const client = new kms.KeyManagementServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
// const locationId = 'global';

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

module.exports = { encrypt };
