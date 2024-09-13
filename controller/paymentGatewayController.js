
const { BASE_URL } = require("../config/config")
const paymentGatewayModel = require("../model/paymentGatewayModel")
const crypto = require('crypto')

const esewa = (req, res) => {
  return paymentGatewayModel.esewa(req.body, req.params.invoice_id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).send(err))
}

const esewaCallback = (req, res) =>{
  return paymentGatewayModel.esewaCallback(req.query.data)
    .then(response => res.redirect(response))
    .catch(err => res.status(400).json(err))
}

const esewaFailed = (req, res) => {
  console.log(req.query)
  return res.redirect(BASE_URL + '/myaccount?name=order-invoice')
}

const khalti = (req, res) => {
  return paymentGatewayModel.khalti(req.body, req.params.invoice_id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).send(err))
}

const khaltiCallback = (req, res) => {
  return paymentGatewayModel.khaltiCallback(req.query)
    .then(response => res.redirect(response))
    .catch(url => res.redirect(url))
}

const khaltiFailed = (req, res) => {
  return res.redirect(BASE_URL)
}

module.exports = { esewa, esewaCallback, khalti, khaltiCallback, esewaFailed, khaltiFailed }