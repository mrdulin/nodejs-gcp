let count = 1;

exports.reuseGlobalVars = (req, res) => {
  count += 1;
  res.send(`count: ${count}`);
};
