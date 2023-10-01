const multer = require("multer");
const { fileUpload, imageFilter } = require("../libs/fileUpload");
const {
  addHobbieModel,
  updateHobbieModel,
  getHobbieModel,
  getHobbieByNameModel,
  deleteHobbieModel,
  getHobbieProductByTitleModel,
} = require("../model/hobbieModel");

exports.uploadHobbieImages = multer({
  storage: fileUpload("public/hobbie-image"),
  fileFilter: imageFilter,
}).single("hobbie-image");

exports.addHobbieController = (req, res) => {
  addHobbieModel(req.body, req.file)
    .then((message) => req.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateHobbieController = (req, res) => {
  updateHobbieModel(req.body, req.file, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getHobbieController = (req, res) => {
  getHobbieModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getHobbieByNameController = (req, res) => {
  getHobbieByNameModel(req.params.name)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getHobbieProductByTitleController =(req, res) => {
  getHobbieProductByTitleModel(req.params.title)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteHobbieController = (req, res) => {
  deleteHobbieModel(req.params.id)
    .then(() => res.status(200).json({ message: `Hobbie Removed` }))
    .catch((err) => res.status(400).send(err));
};
