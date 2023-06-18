const multer = require("multer");
const {
  addBrandModel,
  updateBrandModel,
  getBrandModel,
  getBrandByIdModel,
  deleteBrandModel,
} = require("../model/brandModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.uploadBrandImage = multer({
  storage: fileUpload("public/brands"),
  fileFilter: imageFilter,
}).single("brand-logo");

exports.addBrandController = (req, res) => {
  addBrandModel(req.body, req.file)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateBrandController = (req, res) => {
  updateBrandModel(req.params.id, req.body, req.file)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getBrandController = (req, res) => {
  getBrandModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getBrandByIdController = (req, res) => {
  getBrandByIdModel(req.params.id)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => res.status(400).send(err));
};

exports.deleteBrandController = (req, res) => {
  deleteBrandModel(req.params.id)
    .then(() => res.status(200).json({ message: "Brand removed" }))
    .catch((err) => res.status(400).send(err));
};
