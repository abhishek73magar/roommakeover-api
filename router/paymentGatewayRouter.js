const paymentGatewayController = require('../controller/paymentGatewayController');

const router = require('express').Router()


router
  .post('/esewa/:invoice_id', paymentGatewayController.esewa)
  .get('/esewa/callback', paymentGatewayController.esewaCallback)

router
  .post('/khalti/:invoice_id', paymentGatewayController.khalti)
  .get('/khalti/callback', paymentGatewayController.khaltiCallback)



module.exports = router;