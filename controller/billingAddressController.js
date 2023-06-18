const {
  addBillingAddressModel,
  updateBillingAddressModel,
  getBillingAddressModel,
  getActiveBillingAddressModel,
  getBillingAddressByIdModel,
  deleteBillingAddressModel,
} = require("../model/billingAddressModel");

exports.addBillingAddressController = (req, res) => {
  addBillingAddressModel(req.body, req.user)
    .then(() => res.status(201).json({ message: `Billing address added` }))
    .catch((err) => res.status(400).send(err));
};

exports.updateBillingAddressController = (req, res) => {
  updateBillingAddressModel(req.body, req.params.id, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getBillingAddressController = (req, res) => {
  getBillingAddressModel(req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getActiveBillingAddressController = (req, res) => {
  getActiveBillingAddressModel(req.user)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => res.status(400).send(err));
};

exports.getBillingAddressByIdController = (req, res) => {
  getBillingAddressByIdModel(req.params.id, req.user)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => res.status(400).send(err));
};

exports.deleteBillingAddressController = (req, res) => {
  deleteBillingAddressModel(req.params.id, req.user)
    .then(() => res.status(200).json({ message: "Billing address removed" }))
    .catch((err) => res.status(400).send(err));
};
