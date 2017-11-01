import path from 'path';
import { download } from '../../gcs';

describe('#download', () => {
  it('simple download', async () => {
    const bucketName = 'shadowsocks-218808.appspot.com';
    const filename = '1547012340909WX20190108-124331.png';
    await download(bucketName, filename, { destination: path.resolve(__dirname, `../../../tmp/${filename}`) });
  });
});
