const transactionModel = require('../model/transactionModel')

const get = (req, res) => {
  return transactionModel.get(req.params.invoice_id)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err))
}

module.exports = { get }