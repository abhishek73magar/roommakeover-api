
const invoiceModel = require("../model/invoiceModel")

const get = (req, res) => {
  return invoiceModel.get(req.user)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err))
}

const getById = (req, res) => {
  return invoiceModel.getById(req.params.id, req.user)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err))
}

const getByCollectionId = (req, res) => {
  return invoiceModel.getByCollectionId(req.params.collection_id, req.user)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err.message ?? err))
}





module.exports = { get, getById, getByCollectionId }