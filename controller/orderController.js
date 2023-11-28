const {
  addOrderModel,
  getOrdersModel,
  getOrderByIdModel,
  updateOrderModel,
} = require("../model/orderModel");

exports.addOrderController = (req, res) => {
  addOrderModel(req.body, req.user)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateOrderController = (req, res) => {
  updateOrderModel(req.body, req.params.collectionid)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getOrdersController = (req, res) => {
  getOrdersModel(req.user, req.role)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getOrderByIdController = (req, res) => {
  getOrderByIdModel(req.params.collection_id, req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};
