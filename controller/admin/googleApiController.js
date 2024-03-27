const { generateAuthUrlModel, oAuthTokenVerifyModel, testMailSendModel } = require("../../model/admin/googleApiModel")

exports.generateAuthUrlController = (req, res) => {
  generateAuthUrlModel(req.body)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err))
}


exports.oAuthTokenVerifyController = (req, res) => {
  oAuthTokenVerifyModel(req.query)
    .then(() => res.send('<script>window.close()</script>'))
    .catch(err => res.status(500).send(err))
}

exports.testMailSendController = (req, res) => {
  testMailSendModel(req.body)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}