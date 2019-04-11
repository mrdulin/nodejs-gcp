const path = require('path');

const { encrypt, decrypt } = require('./');

describe('encrypt data test suites', () => {
  it.skip('#encrypt', async () => {
    const options = {
      plaintextFileName: path.resolve(__dirname, './credentials/index.json'),
      ciphertextFileName: path.resolve(__dirname, './credentials/index.json.enc'),
      locationId: 'global',
      keyRingId: 'test',
      cryptoKeyId: 'nodejs-gcp'
    };
    await encrypt(options);
  });

  it('#decrypt', async () => {
    const options = {
      ciphertextFileName: path.resolve(__dirname, './credentials/index.json.enc'),
      plaintextFileName: path.resolve(__dirname, './credentials/index-descrypted.json'),
      locationId: 'global',
      keyRingId: 'test',
      cryptoKeyId: 'nodejs-gcp'
    };
    await decrypt(options);
  });
});
