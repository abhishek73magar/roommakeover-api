const transactionModel = require('../../model/admin/transactionModel')

const get = (req, res) => {
  return transactionModel.get()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

const getByInvoiceId = (req, res) => {
  return transactionModel.getByInvoiceId(req.params.invoice_id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

const update = (req, res) => {
  return transactionModel.update(req.body, req.params.invoice_id)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(400).send(err))
}

module.exports = { get, getByInvoiceId, update }