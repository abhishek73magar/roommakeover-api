const multer = require("multer");
const { addProductForAdminModel, updateProductForAdminModel, getProductForAdminModel, getProductByPIDForAdminModel, deleteProductForAdminModel, getProductSingleImageModel } = require("../../model/admin/productModel");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");


exports.uploadProductImage = multer({
  storage: fileUpload("public/products"),
  fileFilter: imageFilter,
}).array("product-images");


exports.addProductForAdminController = (req, res) => {
  addProductForAdminModel(req.body, req.files)
    .then(msg => res.status(201).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.updateProductForAdminController =(req, res) => {
  updateProductForAdminModel(req.body, req.files, req.params.pid)
  .then(msg => res.status(200).send(msg))
  .catch(err => res.status(400).send(err))
}

exports.getProductForAdminController = (req, res) => {
  getProductForAdminModel(req.query)
  .then(data => res.status(200).json(data))
  .catch(err => res.status(400).send(err))
}

exports.getProductByPIDForAdminController =(req, res) => {
  getProductByPIDForAdminModel(req.params.pid)
  .then(data => res.status(200).json(data))
  .catch(err => res.status(400).send(err))
}

exports.getProductSingleImageConroller = (req, res) => {
  getProductSingleImageModel(req.body)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteProductForAdminController = (req, res) => {
  deleteProductForAdminModel(req.params.pid)
  .then(msg => res.status(200).send(msg))
  .catch(err => res.status(400).send(err))
}