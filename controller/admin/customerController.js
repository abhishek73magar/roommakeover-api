const { getCustomerModel, deleteCustomerModel } = require("../../model/admin/customerModel")

exports.getCustomerController = (req, res) => {
  return getCustomerModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteCustomerController = (req, res) => {
  return deleteCustomerModel(req.params.id)
    .then(() => res.status(200).send('User removed !!'))
    .catch(err => res.status(400).send(err))
}