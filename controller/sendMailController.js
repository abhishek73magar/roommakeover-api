const { sendMailModel } = require("../model/sendMailModel")

exports.sendMailController = (req, res) => {
  sendMailModel(req.body)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}