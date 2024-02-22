const multer = require("multer");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");
const { addSliderImageModel, deleteSliderImageModel, getSliderImageModel } = require("../../model/admin/sliderImageModel");

exports.uploadSliderImage = multer({
  storage: fileUpload("public/slider-images"),
  fileFilter: imageFilter,
}).array('slider-images');

exports.addSliderImageController = (req, res) => {
  addSliderImageModel(req.body, req.files)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getSliderImageController = (req, res) => {
  getSliderImageModel(req.files)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).send(err))
}


exports.deleteSliderImageController = (req, res) => {
  deleteSliderImageModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}