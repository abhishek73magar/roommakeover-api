const { addBlogController, updateBlogController, getBlogController, getBlogByIdController, deleteBlogController, uploadBlogThumbnail } = require('../controller/admin/blogController');
const { uploadCategoryForAdminImage, addCategoryForAdminController, updateCategoryForAdminController, getCategoryForAdminController, getCategoryByIdForAdminController, deleteCategoryForAdminController } = require('../controller/admin/categoryController');
const { updateCustomizationController, getCustomizationController, getCustomizationByIdController, removeCustomizationController } = require('../controller/admin/customizationController');
const { uploadDIYProductThumbnail, addDIYProductController, getDIYProductController, updateDIYProductController, deleteDIYProductController, getDIYProductByIdController } = require('../controller/admin/diyProductController');
const { uploadHobbieThumbnail, addHobbieForAdminController, updateHobbieForAdminController, getHobbieForAdminController, getHobbieByIdForAdminController, deleteHobbieForAdminController } = require('../controller/admin/hobbieController');
const { addHobbieProductController, updateHobbieProductController, uploadHobbieProductThumbnail, getHobbieProductController, getHobbieProductByIdController, deleteHobbieProductController } = require('../controller/admin/hobbieProductController');
const { addMediaController, getMediaController, deleteMediaController, uploadMedia } = require('../controller/admin/mediaController');
const { getOrderForAdminController, updateOrderForAdminController, getOrderByIdForAdminController, deleteOrderByIdController } = require('../controller/admin/orderController');
const { addProductForAdminController, uploadProductImage, updateProductForAdminController, getProductForAdminController, getProductByPIDForAdminController, deleteProductForAdminController, getProductSingleImageConroller, getProductImagesController, deleteProductImageController } = require('../controller/admin/productController');
const { uploadSliderImage, addSliderImageController, deleteSliderImageController, getSliderImageController } = require('../controller/admin/sliderImageController');

const adminAuthController = require('../controller/admin/adminAuthController');
const { getCustomerController, deleteCustomerController } = require('../controller/admin/customerController');
const { homeInfoController } = require('../controller/admin/infoController');
const { generateAuthUrlController, oAuthTokenVerifyController, testMailSendController } = require('../controller/admin/googleApiController');

const invoiceController = require('../controller/admin/invoiceController')
const transactionController = require('../controller/admin/transactionController')

const router = require('express').Router();

// admin list
router
  .post('/login', adminAuthController.login)
  .post('/admin', adminAuthController.create)
  .patch('/admin/:id', adminAuthController.update)
  .get('/admin', adminAuthController.read)
  .get('/admin/:id', adminAuthController.findById)
  .delete('/admin/:id', adminAuthController.remove)

// // for product
router
  .post('/product', uploadProductImage, addProductForAdminController)
  .patch('/product/:pid', uploadProductImage, updateProductForAdminController)
  .post('/product/image', getProductSingleImageConroller)
  .get('/product', getProductForAdminController)
  .get('/product/image/:pid', getProductImagesController)
  .get('/product/:pid', getProductByPIDForAdminController)
  .delete('/product/image/:id', deleteProductImageController)
  .delete('/product/:pid', deleteProductForAdminController);


// for orders 
router
  .get("/order", getOrderForAdminController)
  .get('/order/:collection_id', getOrderByIdForAdminController)
  .patch("/order", updateOrderForAdminController)
  .delete('/order/:id', deleteOrderByIdController)

// for invoice
router
  .post('/invoice', invoiceController.create)
  .get('/invoice', invoiceController.get)
  .get('/invoice/:id', invoiceController.getById)
  .get('/invoice/order/:collection_id', invoiceController.getByCollectionId)
  .delete('/invoice/:id', invoiceController.remove)

// for transaction
router
  .get('/transaction', transactionController.get)
  .get('/transaction/invoice/:invoice_id', transactionController.getByInvoiceId)
  .patch('/transaction/:invoice_id', transactionController.update)

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

// slider image
router
  .post('/slider', uploadSliderImage, addSliderImageController)
  .get('/slider', getSliderImageController)
  .delete('/slider/:id', deleteSliderImageController)

// blogs
router
  .post('/blog', uploadBlogThumbnail, addBlogController)
  .patch('/blog/:id', uploadBlogThumbnail, updateBlogController)
  .get("/blog", getBlogController)
  .get('/blog/:id', getBlogByIdController)
  .delete('/blog/:id', deleteBlogController)

// all blog media
router
  .post('/media', uploadMedia, addMediaController)
  .get('/media', getMediaController)
  .delete('/media/:id', deleteMediaController)

// customization 
router
  .patch('/customization-product/:id', updateCustomizationController)
  .get('/customization-product', getCustomizationController)
  .get('/customization-product/:id', getCustomizationByIdController)
  .delete('/customization-prdoduct/:id', removeCustomizationController)


// customers
router
  .get('/customer', getCustomerController)
  .delete('/customer/:id', deleteCustomerController)


// info routes
router
  .get('/info/home', homeInfoController)

// google refreshtoken gen
router
  .post('/generate-auth-url', generateAuthUrlController)
  .get('/oauth-code', oAuthTokenVerifyController)
  .post('/test-mail', testMailSendController)


module.exports = router;