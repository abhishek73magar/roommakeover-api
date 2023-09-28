const multer = require("multer");
const { fileUpload, imageFilter } = require("../libs/fileUpload");
const {
  addProductModel,
  getProductModel,
  getProductByTablenameModel,
  totalProductsModel,
  updateProductModel,
  deleteProductModel,
  productImageModel,
  topSellingProductModel,
  getOnSellProductModel,
  getSearchProductModel,
  getProductByPIDModel,
  deleteProdcutImageModel,
} = require("../model/productModel");

exports.uploadProductImage = multer({
  storage: fileUpload("public/products"),
  fileFilter: imageFilter,
}).array("product-images");

exports.addProductController = (req, res) => {
  addProductModel(req.body, req.files)
    .then((message) => res.status(201).json({ message }))
    .catch((error) => res.status(400).send(error));
};

exports.getProductController = (req, res) => {
  getProductModel(req.params, req.role)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).send(error));
};

exports.getProductByPIDController = (req, res) => {
  getProductByPIDModel(req.params.pid)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err))
}

exports.getProductByTablenameController = (req, res) => {
  getProductByTablenameModel(req.params, req.role)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.updateProductController = (req, res) => {
  updateProductModel(req.body, req.files, req.params.pid)
    .then((message) => res.status(200).json({ message }))
    .catch((error) => res.status(400).send(error));
};

exports.deleteProductController = (req, res) => {
  deleteProductModel(req.params.pid)
    .then((message) => req.status(200).json({ message }))
    .catch((error) => res.status(400).send(error));
};

exports.productImagesController = (req, res) => {
  productImageModel(req.params.pid)
    .then((images) => res.status(200).json(images))
    .catch((err) => res.status(200).send(err));
};

exports.deleteProductImageController = (req, res) => {
  deleteProdcutImageModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.totalProductController = (req, res) => {
  totalProductsModel()
    .then((msg) => res.status(200).json(msg))
    .catch((error) => res.status(400).send(error));
};

exports.topSellingProductController = (req, res) => {
  topSellingProductModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getOnSellProductController = (req, res) => {
  getOnSellProductModel(req.role)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getSearchProductController = (req, res) => {
  getSearchProductModel(req.params.title, req.role)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};
