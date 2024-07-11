
const invoiceModel = require("../../model/admin/invoiceModel")
const create = (req, res) => {
  return invoiceModel.create(req.body)
    .then(response => res.status(201).json(response))
    .catch(err => res.status(400).send(err))
}


const get = (req, res) => {
  return invoiceModel.get()
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err))
}

const getById = (req, res) => {
  return invoiceModel.getById(req.params.id)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err))
}

const getByCollectionId = (req, res) => {
  return invoiceModel.getByCollectionId(req.params.collection_id)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).send(err.message ?? err))
}

const remove = (req, res) => {
  return invoiceModel.remove(req.params.id)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(400).send(err))
}


module.exports = { create, get, getById, getByCollectionId, remove }