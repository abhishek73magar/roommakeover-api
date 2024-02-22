const { getCustomerModel } = require("../../model/admin/customerModel")

exports.getCustomerController = (req, res) => {
  return getCustomerModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status.send(err))
}