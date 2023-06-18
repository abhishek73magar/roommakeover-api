const multer = require("multer");
const {
  addSliderImageModel,
  getSliderImageModel,
  deleteSliderImagesModel,
} = require("../model/sliderImageModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.uploadSliderImage = multer({
  storage: fileUpload("public/slider-images"),
  fileFilter: imageFilter,
}).array('slider-images');

exports.addSliderImageController = (req, res) => {
  addSliderImageModel(req.files)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getSliderImageController = (req, res) => {
  getSliderImageModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteSliderImageController = (req, res) => {
  deleteSliderImagesModel(req.params.id)
    .then(() => res.status(200).json({ message: `Removed slider image` }))
    .catch((err) => res.status(400).send(err));
};
