const multer = require("multer");
const { addHobbieProductModel, updateHobbieProductModel, getHobbieProductModel, deleteHobbieProductModel, getHobbieProductByIdModel } = require("../../model/admin/hobbieProductModel");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");

exports.uploadHobbieProductThumbnail = multer({
  storage: fileUpload("public/hobbie-products"),
  fileFilter: imageFilter,
}).single("thumbnail");

exports.addHobbieProductController = (req, res) => {
    addHobbieProductModel(req.body, req.file)
      .then(msg => res.status(201).send(msg))
      .catch(err => res.status(400).send(err))
}

exports.updateHobbieProductController = (req, res) => {
    updateHobbieProductModel(req.body, req.file, req.params.id)
      .then(msg => res.status(200).send(msg))
      .catch(err => res.status(400).send(err))
}

exports.getHobbieProductController = (req, res) => {
    getHobbieProductModel()
      .then(data => res.status(200).json(data))
      .catch(err => res.status(400).send(err))
}

exports.getHobbieProductByIdController = (req, res) => {
    getHobbieProductByIdModel()
      .then(data => res.status(200).json(data))
      .catch(err => res.status(400).send(err))
}

exports.deleteHobbieProductController = (req, res) => {
    deleteHobbieProductModel()
      .then(msg => res.status(200).send(msg))
      .catch(err => res.status(400).send(err))
}