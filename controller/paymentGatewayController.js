
const { BASE_URL } = require("../config/config")
const paymentGatewayModel = require("../model/paymentGatewayModel")
const crypto = require('crypto')

const esewa = (req, res) => {
  paymentGatewayModel.esewa(req.body, req.params.invoice_id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).send(err))
}

const esewaCallback = (req, res) =>{
  paymentGatewayModel.esewaCallback(req.query.data)
    .then(response => res.redirect(response))
    .catch(err => res.status(400).json(err))
}

const khalti = (req, res) => {
  paymentGatewayModel.khalti(req.body, req.params.invoice_id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).send(err))
}

const khaltiCallback = (req, res) => {
  paymentGatewayModel.khaltiCallback(req.query)
    .then(response => res.redirect(response))
    .catch(err => res.status(400).json(err))
}


module.exports = { esewa, esewaCallback, khalti, khaltiCallback }