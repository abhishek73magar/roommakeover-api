const multer = require("multer");
const { fileUpload, imageFilter } = require("../../libs/fileUpload");
const { addBlogModel, updateBlogModel, getBlogModel, getBlogByIdModel, deleteBlogModel } = require("../../model/admin/blogModel")


exports.uploadBlogThumbnail = multer({
  storage: fileUpload("public/blog"),
  fileFilter: imageFilter,
}).single("thumbnail");

exports.addBlogController = (req, res) => {
  addBlogModel(req.body, req.file)
    .then(msg => res.status(201).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.updateBlogController = (req, res) => {
  updateBlogModel(req.body, req.file, req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}

exports.getBlogController = (req, res) => {
  getBlogModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.getBlogByIdController = (req, res) => {
  getBlogByIdModel(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

exports.deleteBlogController = (req, res) => {
  deleteBlogModel(req.params.id)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(400).send(err))
}