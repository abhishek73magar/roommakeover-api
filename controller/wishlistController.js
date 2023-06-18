const {
  addWishlistModel,
  updateWishlistModel,
  getWishlistModel,
  getWishlistByIdModel,
  deleteWishlistModel,
  removeWishListModel,
} = require("../model/wishlistModel");

exports.addWishlistController = (req, res) => {
  addWishlistModel(req.body, req.user)
    .then((message) => res.status(201).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateWishlistController = (req, res) => {
  updateWishlistModel(req.body, req.params.id)
    .then(() => res.status(200).json({ message: `Update successfully` }))
    .catch((err) => res.status(400).send(err));
};

exports.getWishlistController = (req, res) => {
  getWishlistModel(req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getWishlistByIdController = (req, res) => {
  getWishlistByIdModel(req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.removeWishlistController = (req, res) => {
  removeWishListModel(req.params.pid, req.user)
    .then(() => res.status(200).json({ message: "Product removed" }))
    .catch((err) => res.status(400).send(err));
};

exports.deleteWishlistController = (req, res) => {
  deleteWishlistModel(req.params.id)
    .then(() => res.status(200).json({ message: "Product removed" }))
    .catch((err) => res.status(400).send(err));
};
