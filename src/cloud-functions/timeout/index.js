async function dontUseSetTimeout(req, res) {
  setTimeout(() => {
    console.log('Function running...');
    res.sendStatus(200);
  }, 70 * 1000);
}

exports.dontUseSetTimeout = dontUseSetTimeout;
