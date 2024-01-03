const { updateCustomizationModel, getCustomizationModel, getCustomizationByIdModel, removeCustomizationModel } = require("../../model/admin/customizationModel")

exports.updateCustomizationController = (req, res) => {
  updateCustomizationModel(req.body, req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.getCustomizationController = (req, res) => {
  getCustomizationModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getCustomizationByIdController = (req, res) => {
  getCustomizationByIdModel(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.removeCustomizationController = (req, res) =>{
  removeCustomizationModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}