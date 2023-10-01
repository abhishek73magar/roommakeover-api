const {
  addCheckoutModel,
  getCheckoutModel,
  updateCheckoutModel,
  deleteCheckoutModel,
  removeCheckoutModel,
  addMultipleProductAsCheckoutModel,
} = require("../model/checkoutModel");

exports.addCheckoutController = (req, res) => {
  addCheckoutModel(req.body, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.addMultipleProductAsCheckoutController = (req, res) => {
  addMultipleProductAsCheckoutModel(req.body, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
}

exports.updateCheckoutContoller = (req, res) => {
  updateCheckoutModel(req.body, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.getCheckoutController = (req, res) => {
  getCheckoutModel(req.user)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.deleteCheckoutController = (req, res) => {
  deleteCheckoutModel(req.params.id)
    .then(() => {
      return res.status(200).json({ message: `Product remove from checkout` });
    })
    .catch((err) => res.status(400).send(err));
};

exports.removeCheckoutController = (req, res) => {
  removeCheckoutModel(req.params.pid, req.user)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};
