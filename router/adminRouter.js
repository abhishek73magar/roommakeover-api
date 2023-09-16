const { getOrderForAdminController, updateOrderForAdminController, getOrderByIdForAdminController } = require('../controller/admin/orderController');

const router = require('express').Router();


// for orders 
router
  .get("/order", getOrderForAdminController)
  .get('/order/:collection_id', getOrderByIdForAdminController)
  .patch("/order/:collection_id", updateOrderForAdminController)
  .delete('/order/:collection_id')

module.exports = router;