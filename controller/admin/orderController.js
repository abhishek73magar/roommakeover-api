const { getOrderForAdminModel, updateOrderForAdminModel, getOrderByIdForAdminModel } = require("../../model/admin/orderModel")

exports.getOrderForAdminController = (req, res) => {
  getOrderForAdminModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getOrderByIdForAdminController = (req, res) => {
  getOrderByIdForAdminModel(req.params.collection_id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.updateOrderForAdminController = (req, res) => {
  updateOrderForAdminModel(req.body, req.query)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}