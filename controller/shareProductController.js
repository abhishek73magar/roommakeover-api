const multer = require("multer");
const { addShareProductModel, updateShareProductModel, getShareProductForUserModel, getShareProductModel, deleteShareProductModel, getShareProductByIdModel, getShareProductByTitleModel, getShareProductImagesModel, deleteShareProductImageByIdModel } = require("../model/shareProductModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.uploadShareProduct =  multer({
  storage: fileUpload("public/share-product"),
  fileFilter: imageFilter,
}).array("product-images");

exports.addShareProductController = (req, res) => {
  addShareProductModel(req.body, req.files,   req.user)
    .then(msg => res.status(201).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.updateShareProductController = (req, res) => {
  updateShareProductModel(req.body, req.files, req.params.id, req.user)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.getShareProductForUserController = (req, res) => {
  getShareProductForUserModel(req.user)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getShareProductController = (req, res) => {
  getShareProductModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getShareProductByIdController = (req, res) => {
  getShareProductByIdModel(req.params.id, req.user)
    .then(data => res.status(200).json(data[0]))
    .catch(err => res.status(400).send(err))
}

exports.getShareProductByTitleController = (req, res) => {
  getShareProductByTitleModel(req.params.title)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getShareProductImagesController = (req, res) => {
  getShareProductImagesModel(req.params.pid)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteShareProductImageByIdController = (req, res) => {
  deleteShareProductImageByIdModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.deleteShareProductController = (req, res) => {
  deleteShareProductModel(req.params.id, req.user)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

