const { uploadCategoryForAdminImage, addCategoryForAdminController, updateCategoryForAdminController, getCategoryForAdminController, getCategoryByIdForAdminController, deleteCategoryForAdminController } = require('../controller/admin/categoryController');
const { uploadDIYProductThumbnail, addDIYProductController, getDIYProductController, updateDIYProductController, deleteDIYProductController, getDIYProductByIdController } = require('../controller/admin/diyProductController');
const { uploadHobbieThumbnail, addHobbieForAdminController, updateHobbieForAdminController, getHobbieForAdminController, getHobbieByIdForAdminController, deleteHobbieForAdminController } = require('../controller/admin/hobbieController');
const { addHobbieProductController, updateHobbieProductController, uploadHobbieProductThumbnail, getHobbieProductController, getHobbieProductByIdController, deleteHobbieProductController } = require('../controller/admin/hobbieProductController');
const { getOrderForAdminController, updateOrderForAdminController, getOrderByIdForAdminController } = require('../controller/admin/orderController');
const { addProductForAdminController, uploadProductImage, updateProductForAdminController, getProductForAdminController, getProductByPIDForAdminController, deleteProductForAdminController, getProductSingleImageConroller } = require('../controller/admin/productController');

const router = require('express').Router();


// // for product
router
  .post('/product', uploadProductImage, addProductForAdminController)
  .patch('/product/:pid', uploadProductImage, updateProductForAdminController)
  .post('/product/image', getProductSingleImageConroller)
  .get('/product', getProductForAdminController)
  .get('/product/page/:total', getProductForAdminController)
  .get('/product/page/:total/:pagenumber', getProductForAdminController)
  .get('/product/:pid', getProductByPIDForAdminController)
  .delete('/product/:pid', deleteProductForAdminController);


// for orders 
router
  .get("/order", getOrderForAdminController)
  .get('/order/:collection_id', getOrderByIdForAdminController)
  .patch("/order", updateOrderForAdminController)
  .delete('/order/:collection_id')


// for hobbies 
router
  .post('/hobbie', uploadHobbieThumbnail, addHobbieForAdminController)
  .patch('/hobbie/:id', uploadHobbieThumbnail, updateHobbieForAdminController)
  .get('/hobbie', getHobbieForAdminController)
  .get('/hobbie/:id', getHobbieByIdForAdminController)
  .delete('/hobbie/:id', deleteHobbieForAdminController)

// for product category
router
  .post("/category", uploadCategoryForAdminImage, addCategoryForAdminController)
  .patch("/category/:id", uploadCategoryForAdminImage, updateCategoryForAdminController)
  .get("/category", getCategoryForAdminController)
  .get("/category/:id", getCategoryByIdForAdminController)
  .delete("/category/:id", deleteCategoryForAdminController)
  

// for hobbie product
router
  .post('/hobbie-product', uploadHobbieProductThumbnail, addHobbieProductController)
  .patch('/hobbie-product/:id', uploadHobbieProductThumbnail, updateHobbieProductController)
  .get('/hobbie-product', getHobbieProductController)
  .get('/hobbie-product/:id', getHobbieProductByIdController)
  .delete('/hobbie-product/:id', deleteHobbieProductController)

router
  .post('/hobbie/list')
  .patch('hobbie/list/:id')
  .get('/hobbie/list')

// for diy product
router
  .post('/diy-product', uploadDIYProductThumbnail, addDIYProductController)
  .patch('/diy-product/:id', uploadDIYProductThumbnail, updateDIYProductController)
  .get('/diy-product', getDIYProductController)
  .get('/diy-product/:id', getDIYProductByIdController)
  .delete('/diy-product/:id', deleteDIYProductController)


module.exports = router;