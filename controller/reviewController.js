const {
  addReviewModel,
  getReviewModel,
  getReviewByProductIdModel,
  updateReviewModel,
  deleteReviewModel,
  getReviewByIdModel,
} = require("../model/reviewModel");

exports.addReviewConttroller = (req, res) => {
  addReviewModel(req.body, req.user)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateReviewController = (req, res) => {
  updateReviewModel(req.body, req.params.id)
    .then(() => res.status(200).json({ message: `Review Updated` }))
    .catch((err) => res.status(400).send(err));
};

exports.getReviewController = (req, res) => {
  getReviewModel(req.params, req.role, req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getReviewById = (req, res) => {
  getReviewByIdModel(req.params.id)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => res.status(400).send(err));
};

exports.getReviewByProductIdController = (req, res) => {
  getReviewByProductIdModel(req.params.pid)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteReviewController = (req, res) => {
  deleteReviewModel(req.params.id)
    .then(() => res.status(200).json({ message: "Review Removed" }))
    .catch((err) => res.status(400).send(err));
};
