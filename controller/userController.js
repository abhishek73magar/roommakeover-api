const {
  signUpUserModel,
  loginUserModel,
  updateUserModel,
  getUserModel,
  getUserByIdModel,
  logOutUserModel,
  loginWithSocialUserModel,
  verifyUserModel,
  updateUserBioModel,
} = require("../model/userModel");

exports.signUpUserController = (req, res) => {
  signUpUserModel(req.body, res)
    .then((token) => res.status(201).json({ token }))
    .catch((err) => res.status(400).send(err));
};

exports.loginUserController = (req, res) => {
  loginUserModel(req.body, res)
    .then((token) => res.status(200).json({ token }))
    .catch((err) => res.status(400).send(err));
};

exports.loginWithSocialController = (req, res) => {
  loginWithSocialUserModel(req.body, res)
    .then((token) => res.status(200).json({ token }))
    .catch((err) => res.status(400).send(err));
};

exports.logOutUserController = (req, res) => {
  logOutUserModel(req, res)
    .then((message) => res.status(200).send(message))
    .catch((err) => res.status(400).send(err));
};

exports.updateUserController = (req, res) => {
  updateUserModel(req.body, req.params.id)
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).send(err));
};

exports.updateUserBioController = (req, res) => {
  updateUserBioModel(req.body, req.user)
    .then(msg => res.status(200).send(msg))
    .catch(err => res.status(500).send(err))
}

exports.getUserController = (req, res) => {
  getUserModel()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.getUserByIdController = (req, res) => {
  getUserByIdModel(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).send(err));
};

exports.verifyUserController = (req, res) => {
  verifyUserModel(req)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      if (err.auth) {
        res.clearCookie("usertoken");
        return res.status(401).json(err.error);
      }
      return res.status(400).send(err.error);
    });
};
