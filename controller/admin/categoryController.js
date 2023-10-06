const multer = require("multer");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");
const { addAdminCategoryModel, updateAdminCategoryModel, getAdminCategoryModel, getAdminCategoryByIdModel, deleteAdminCategoryModel } = require("../../model/admin/categoryModel");

exports.uploadCategoryImage = multer({
  storage: fileUpload("public/categorysbg"),
  fileFilter: imageFilter,
}).single("imagesrc");

exports.addAdminCategoryController = (req, res) => {
  addAdminCategoryModel(req.body, req.file)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateAdminCategoryController = (req, res) => {
  updateAdminCategoryModel(req.body, req.file, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getAdminCategoryController = (req, res) => {
  getAdminCategoryModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getAdminCateogryByIdController = (req, res) => {
  getAdminCategoryByIdModel(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteAdminCategoryController = (req, res) => {
  deleteAdminCategoryModel(req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
