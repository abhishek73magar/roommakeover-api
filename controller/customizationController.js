const multer = require("multer");
const { imageFilter, fileUpload } = require("../libs/fileUpload");
const { addCustomizationModel, getCustomizationProductModel } = require("../model/customizationModel")

exports.uploadCustomizationImage = multer({
  storage: fileUpload("public/customization-product"),
  fileFilter: imageFilter,
}).array("customiazation-images");

exports.addCustomizationController = (req, res) => {
  addCustomizationModel(req.boyd, req.files)
    .then(msg => res.status(201).send(msg))
    .catch(err => res.status(400).send(err))
}


exports.getCustomizationController = (req, res) => {
  getCustomizationProductModel(req.user)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}
