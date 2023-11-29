const { getDiyProductModel, getDiyProductAllTitleModel, getDiyProductByTitleModel } = require("../model/diyProductModel")

exports.getDiyProductController = (req, res) => {
  getDiyProductModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getDiyProductAllTitleController = (req, res) => {
  getDiyProductAllTitleModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.send(400).send(err))
}

exports.getDiyProductByTitleController = (req, res) => {
  getDiyProductByTitleModel(req.params.title)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(200).send(err))
}