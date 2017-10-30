import { createKeyRing, createCryptoKey, listKeyRings } from '../../../kms';

describe('creating-symmetric-keys test suites', () => {
  const keyRingId = 'test-2';
  it.skip('#createKeyRing', async () => {
    const keyRing = await createKeyRing(keyRingId);
    console.log(keyRing);
  });

  it('#listKeyRings', async () => {
    const actualValue = await listKeyRings();
    console.log('actualValue: ', actualValue);
  });

  it('#createCryptoKey', async () => {
    const cryptoKeyId = 'access_token';
    const actualValue = await createCryptoKey(keyRingId, cryptoKeyId);
    console.log('actualValue: ', actualValue);
  });
});
