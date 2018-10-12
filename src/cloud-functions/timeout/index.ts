async function afterTimeout(req, res) {
  setTimeout(() => {
    console.log('Function running...');
    res.end();
  }, 10 * 1000);
}

export { afterTimeout };
