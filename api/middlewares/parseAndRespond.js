export default (req, res) => {
  const msg = req.responsePayload ? req.responsePayload : [];
  res.status(200).send({
    ok: true,
    data: msg,
  });
};
