const { getBlogModel, getBlogByTitleModel, getBlogOtherInfoModel } = require("../model/blogModel")

exports.getBlogController = (req, res) => {
  getBlogModel(req.query)
  .then(data => res.status(200).json(data))
  .catch(err => req.status(400).send(err))
}

exports.getBlogByTitleController = (req, res) => {
  getBlogByTitleModel(req.params.title)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getBlogOtherInfoController = (req, res) => {
  getBlogOtherInfoModel(req.query)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}