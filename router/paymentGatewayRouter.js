const paymentGatewayController = require('../controller/paymentGatewayController');

const router = require('express').Router()


router
  .post('/esewa/:invoice_id', paymentGatewayController.esewa)
  .get('/esewa/callback', paymentGatewayController.esewaCallback)
  .get('/esewa/failed', paymentGatewayController.esewaFailed)

router
  .post('/khalti/:invoice_id', paymentGatewayController.khalti)
  .get('/khalti/callback', paymentGatewayController.khaltiCallback)
  .get('/khalti/payment/failed', paymentGatewayController.khaltiFailed)



module.exports = router;