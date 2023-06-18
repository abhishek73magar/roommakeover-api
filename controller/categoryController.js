const multer = require("multer");
const {
  addCategoryModel,
  updateCategoryModel,
  getCategoryModel,
  deleteCategoryModel,
  getCategoryByIdModel,
} = require("../model/categoryModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.uploadCategoryImage = multer({
  storage: fileUpload("public/categorysbg"),
  fileFilter: imageFilter,
}).single("imagesrc");

exports.addCategoryController = (req, res) => {
  addCategoryModel(req.body, req.file)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateCategoryController = (req, res) => {
  updateCategoryModel(req.body, req.file, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getCategoryController = (req, res) => {
  getCategoryModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getCateogryByIdController = (req, res) => {
  getCategoryByIdModel(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteCategoryController = (req, res) => {
  deleteCategoryModel(req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
