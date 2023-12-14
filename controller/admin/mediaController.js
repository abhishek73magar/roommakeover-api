const multer = require("multer");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");
const { addMediaModel, getMediaModel, deleteMediaModel } = require("../../model/admin/mediaModel")

exports.uploadMedia = multer({
  storage: fileUpload("public/media"),
  fileFilter: imageFilter,
}).array("media-images");


exports.addMediaController = (req, res) => {
  addMediaModel(req.files)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getMediaController = (req, res) => {
  getMediaModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteMediaController = (req, res) => {
  deleteMediaModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}