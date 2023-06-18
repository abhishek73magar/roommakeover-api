const multer = require("multer");
const {
  addBannerModel,
  getBannerModel,
  deleteBannerModel,
  getBannerByTypeModel,
} = require("../model/bannerModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.uploadBannerImage = multer({
  storage: fileUpload("public/banners"),
  fileFilter: imageFilter,
}).single("banner");

exports.addBannerController = (req, res) => {
  addBannerModel(req.body, req.file)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateBannerController = (req, res) => {
  addBannerModel(req.body, req.file, req.params.type)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getBannerController = (req, res) => {
  getBannerModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getBannerByTypeController = (req, res) => {
  getBannerByTypeModel(req.params.type)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteBannerController = (req, res) => {
  deleteBannerModel(req.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
