async function operateVM(req, res) {
  console.log(req.body);
  res.sendStatus(200);
}
exports.operateVM = operateVM;
