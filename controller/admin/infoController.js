const { homeInfoModel } = require("../../model/admin/infoModel")

exports.homeInfoController = (req, res) => {
  homeInfoModel()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send(err))
}

