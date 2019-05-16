function whatIsThis(req, res) {
  console.log('this: ', this); // The global namespace object.
  res.sendStatus(200);
}

exports.whatIsThis = whatIsThis;
