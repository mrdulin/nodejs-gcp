import { StorageService } from './';

const mockedFile = {
  download: jest.fn()
};

const mockedBucket = {
  file: jest.fn(() => mockedFile)
};

const mockedStorage = {
  bucket: jest.fn(() => mockedBucket)
};

const storageService = new StorageService();

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn(() => mockedStorage)
  };
});

describe('StorageService', () => {
  describe('#_downloadFromBucket', () => {
    it('t1', async () => {
      const name = 'jest/ts';
      // tslint:disable-next-line: no-string-literal
      const actualValue = await storageService['_downloadFromBucket'](name);
      expect(mockedBucket.file).toBeCalledWith(name);
      expect(mockedFile.download).toBeCalledWith({ destination: 'ts', validation: false });
      expect(actualValue).toBe('ts');
    });
  });
});
