const request = require('request-promise');

const r = request.defaults({ proxy: 'http://137.135.94.34:3210' });

const uri = 'http://it-ebooks-api.info/v1/search/mongodb';

exports.proxy = async (req, res) => {
  try {
    const result = await r.get(uri);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};
