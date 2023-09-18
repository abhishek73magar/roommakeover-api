const multer = require("multer");
const { addHobbieForAdminModel, updateHobbieForAdminModel, getHobbieForAdminModel, getHobbieByIdForAdminModel, deleteHobbieByIdForAdminModel } = require("../../model/admin/hobbieModel");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");


exports.uploadHobbieThumbnail = multer({
  storage: fileUpload("public/hobbies"),
  fileFilter: imageFilter,
}).array("thumbnail");

exports.addHobbieForAdminController = (req, res) => {
  addHobbieForAdminModel(req.body, req.files)
    .then(msg => res.status(201).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.updateHobbieForAdminController = (req, res) => {
  updateHobbieForAdminModel(req.body, req.files, req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.getHobbieForAdminController = (req, res) => {
  getHobbieForAdminModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getHobbieByIdForAdminController = (req, res) => {
  getHobbieByIdForAdminModel(req.params.id)
    .then(data => res.status(200).json(data[0]))
    .catch(err => res.status(400).send(err))
}

exports.deleteHobbieForAdminController = (req, res) => {
  deleteHobbieByIdForAdminModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}