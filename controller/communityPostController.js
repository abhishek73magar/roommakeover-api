const multer = require("multer");
const {
  addCommunityPostModel,
  updateCommunityPostModel,
  getCommunityPostModel,
  getCommunityPostByTableNameModel,
  deleteCommunityPostModel,
} = require("../model/communityPostModel");
const { fileUpload, imageFilter } = require("../libs/fileUpload");

exports.addCommunityImages = multer({
  storage: fileUpload("public/ourcommunity"),
  fileFilter: imageFilter,
}).array("community-post-images");

exports.addCommunityPostController = (req, res) => {
  addCommunityPostModel(req.body, req.files, req.user)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateCommunityPostController = (req, res) => {
  updateCommunityPostModel(req.body, req.files, req.params.pid, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getCommunityPostController = (req, res) => {
  getCommunityPostModel(req.params, req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getCommunityPostByTableNameController = (req, res) => {
  getCommunityPostByTableNameModel(req.params, req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteCommunityPostController = (req, res) => {
  deleteCommunityPostModel(req.params.pid, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
