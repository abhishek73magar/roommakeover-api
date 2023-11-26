const multer = require("multer");
const { addDIYProductModel, updateDIYProductModel, getDIYProductModel, deleteDIYProductModel, getDIYProductByIdModel } = require("../../model/admin/DIYProductModel");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");

exports.uploadDIYProductThumbnail = multer({
  storage: fileUpload("public/diy-products"),
  fileFilter: imageFilter,
}).single("thumbnail");

exports.addDIYProductController = (req, res) => {
    addDIYProductModel(req.body, req.file)
      .then(msg => res.status(201).send(msg))
      .catch(err => res.status(400).send(err))
}

exports.updateDIYProductController = (req, res) => {
    updateDIYProductModel(req.body, req.file, req.params.id)
      .then(msg => res.status(200).send(msg))
      .catch(err => res.status(400).send(err))
}

exports.getDIYProductController = (req, res) => {
    getDIYProductModel()
      .then(data => res.status(200).json(data))
      .catch(err => res.status(400).send(err))
}

exports.getDIYProductByIdController = (req, res) => {
    getDIYProductByIdModel(req.params.id)
      .then(data => res.status(200).json(data))
      .catch(err => res.status(400).send(err))
}

exports.deleteDIYProductController = (req, res) => {
    deleteDIYProductModel(req.params.id)
      .then(msg => res.status(200).send(msg))
      .catch(err => res.status(400).send(err))
}