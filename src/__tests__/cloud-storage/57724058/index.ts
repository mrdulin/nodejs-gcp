import { Storage } from '@google-cloud/storage';

class StorageService {
  private storage = new Storage({
    projectId: 'PROJECT_NAME',
    keyFilename: ''
  });

  get bucket() {
    return this.storage.bucket('fundee-assets');
  }

  private async _downloadFromBucket(name) {
    const file = this.bucket.file(`${name}`);
    const destination = `${name}`.split('/').pop();
    await file.download({ destination, validation: false });
    return destination;
  }
}

export { StorageService };
