const { uploadHobbieThumbnail, addHobbieForAdminController, updateHobbieForAdminController, getHobbieForAdminController, getHobbieByIdForAdminController, deleteHobbieForAdminController } = require('../controller/admin/hobbieController');
const { getOrderForAdminController, updateOrderForAdminController, getOrderByIdForAdminController } = require('../controller/admin/orderController');
const { addProductForAdminController, uploadProductImage, updateProductForAdminController, getProductForAdminController, getProductByPIDForAdminController, deleteProductForAdminController } = require('../controller/admin/productController');

const router = require('express').Router();


// for product
router
  .post('/product', uploadProductImage, addProductForAdminController)
  .patch('/product/:pid', uploadProductImage, updateProductForAdminController)
  .get('/product', getProductForAdminController)
  .get('/product/page/:total', getProductForAdminController)
  .get('/product/page/:total/:pagenumber', getProductForAdminController)
  .get('/product/:pid', getProductByPIDForAdminController)
  .delete('/product/:pid', deleteProductForAdminController)

// for orders 
router
  .get("/order", getOrderForAdminController)
  .get('/order/:collection_id', getOrderByIdForAdminController)
  .patch("/order/:collection_id", updateOrderForAdminController)
  .delete('/order/:collection_id')


// for hobbies 
router
  .post('/hobbie', uploadHobbieThumbnail, addHobbieForAdminController)
  .patch('/hobbie/:id', uploadHobbieThumbnail, updateHobbieForAdminController)
  .get('/hobbie', getHobbieForAdminController)
  .get('/hobbie/:id', getHobbieByIdForAdminController)
  .delete('/hobbie/:id', deleteHobbieForAdminController)

router
  .post('/hobbie/list')
  .patch('hobbie/list/:id')
  .get('/hobbie/list')

module.exports = router;