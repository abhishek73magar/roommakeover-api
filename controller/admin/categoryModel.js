const multer = require("multer");
const {
  addCategoryForAdminModel,
  updateCategoryForAdminModel,
  getCategoryForAdminModel,
  deleteCategoryForAdminModel,
  getCategoryByIdForAdminModel,
} = require("../../model/admin/categoryModel");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");

exports.uploadCategoryForAdminImage = multer({
  storage: fileUpload("public/categorysbg"),
  fileFilter: imageFilter,
}).single("imagesrc");

exports.addCategoryForAdminController = (req, res) => {
  addCategoryForAdminModel(req.body, req.file)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateCategoryForAdminController = (req, res) => {
  updateCategoryForAdminModel(req.body, req.file, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getCategoryForAdminController = (req, res) => {
  getCategoryForAdminModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getCateogryByIdForAdminController = (req, res) => {
  getCategoryByIdForAdminModel(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteCategoryForAdminController = (req, res) => {
  deleteCategoryForAdminModel(req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
