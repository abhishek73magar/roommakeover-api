const {
  uploadBannerImage,
  addBannerController,
  updateBannerController,
  getBannerController,
  deleteBannerController,
  getBannerByTypeController,
} = require("../controller/bannerController");
const {
  addBillingAddressController,
  updateBillingAddressController,
  getBillingAddressController,
  getActiveBillingAddressController,
  getBillingAddressByIdController,
  deleteBillingAddressController,
} = require("../controller/billingAddressController");
const {
  uploadBrandImage,
  addBrandController,
  updateBrandController,
  getBrandController,
  getBrandByIdController,
  deleteBrandController,
} = require("../controller/brandController");
const {
  addCategoryController,
  updateCategoryController,
  getCategoryController,
  deleteCategoryController,
  getCateogryByIdController,
  uploadCategoryImage,
  getSubCategoryByNameController,
} = require("../controller/categoryController");
const {
  addCheckoutController,
  updateCheckoutContoller,
  getCheckoutController,
  deleteCheckoutController,
  removeCheckoutController,
  addMultipleProductAsCheckoutController,
} = require("../controller/checkoutController");
const {
  addCommunityImages,
  addCommunityPostController,
  updateCommunityPostController,
  getCommunityPostController,
  getCommunityPostByTableNameController,
  deleteCommunityPostController,
} = require("../controller/communityPostController");
const {
  uploadHobbieImages,
  addHobbieController,
  updateHobbieController,
  getHobbieController,
  getHobbieByNameController,
  deleteHobbieController,
  getHobbieProductByTitleController,
} = require("../controller/hobbieController");
const {
  addOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderController,
} = require("../controller/orderController");
const {
  getProductController,
  uploadProductImage,
  addProductController,
  getProductByTablenameController,
  totalProductController,
  updateProductController,
  deleteProductController,
  productImagesController,
  topSellingProductController,
  getOnSellProductController,
  getSearchProductController,
  getProductByPIDController,
  deleteProductImageController,
  getProductByCategoryNameController,
  getProductByTitleController,
  getProductOtherInfoController
} = require("../controller/productController");
const {
  getReviewController,
  getReviewByProductIdController,
  deleteReviewController,
  updateReviewController,
  addReviewConttroller,
} = require("../controller/reviewController");
const { uploadShareProduct, addShareProductController, getShareProductByIdController, updateShareProductController, deleteShareProductController, getShareProductForUserController, getShareProductController, getShareProductImagesController, deleteShareProductImageByIdController, getShareProductByTitleController } = require("../controller/shareProductController");
const {
  uploadSliderImage,
  addSliderImageController,
  getSliderImageController,
  deleteSliderImageController,
} = require("../controller/sliderImageController");
const {
  signUpUserController,
  loginUserController,
  updateUserController,
  getUserController,
  getUserByIdController,
  logOutUserController,
  loginWithSocialController,
  verifyUserController,
} = require("../controller/userController");
const {
  addWishlistController,
  updateWishlistController,
  getWishlistController,
  getWishlistByIdController,
  deleteWishlistController,
  removeWishlistController,
} = require("../controller/wishlistController");

const router = require("express").Router();

router.get("/test", (req, res) => res.send("api is running"));

// products
router
  .post("/product", uploadProductImage, addProductController)
  .patch("/product/:pid", uploadProductImage, updateProductController)

  .get("/product/other-info", getProductOtherInfoController)
  .get("/product/category/:name", getProductByCategoryNameController)
  .get('/product/:title', getProductByTitleController)
  .get('/product/pid/:pid', getProductByPIDController)
  .get("/product/tablename/:colname/:value", getProductByTablenameController)
  .get("/product/search/:title", getSearchProductController)
  .get("/product", getProductController)
  .get("/totalproduct", totalProductController)
  .delete("/product/:pid", deleteProductController)
  .get("/productimages/:pid", productImagesController)
  .delete('/productimages/:id', deleteProductImageController)
  .get("/topsellingproduct", topSellingProductController)
  .get("/onsaleproduct", getOnSellProductController);

// orders
router
  .post("/order", addOrderController)
  .patch("/order/:collectionid", updateOrderController)
  .get("/order", getOrdersController)
  .get("/order/history/:total")
  .get("/order/:collection_id", getOrderByIdController);

// user auth
router
  .post("/signin", signUpUserController)
  .post("/login", loginUserController)
  .post("/logout", logOutUserController)
  .post("/loginwithsocial", loginWithSocialController)
  .patch("/user/:id", updateUserController)
  .get("/user", getUserController)
  .get("/verify-user", verifyUserController)
  .get("/user/:id", getUserByIdController);

// cateogrys
router
  .post("/category", uploadCategoryImage, addCategoryController)
  .patch("/category/:id", uploadCategoryImage, updateCategoryController)
  .get("/category", getCategoryController)
  .get('/category/sub/:name', getSubCategoryByNameController)
  .get("/category/:id", getCateogryByIdController)
  .delete("/category/:id", deleteCategoryController)
  .get("/topsellingcategory");

// checkout
router
  .post("/checkout", addCheckoutController)
  .post('/checkout/multiple-product', addMultipleProductAsCheckoutController)
  .patch("/checkout/:id", updateCheckoutContoller)
  .get("/checkout", getCheckoutController)
  .get("/checkout/:userid")
  .delete("/checkout/:id", deleteCheckoutController)
  .delete("/checkout/remove/:pid", removeCheckoutController);

// wishlist
router
  .post("/wishlist", addWishlistController)
  .patch("/wishlist/:id", updateWishlistController)
  .get("/wishlist", getWishlistController)
  .get("/wishlist/:id", getWishlistByIdController)
  .delete("/wishlist/:id", deleteWishlistController)
  .delete("/wishlist/remove/:pid", removeWishlistController);

// billing address
router
  .post("/billingaddress", addBillingAddressController)
  .patch("/billingaddress/:id", updateBillingAddressController)
  .get("/billingaddress", getBillingAddressController)
  .get("/billingaddress/active", getActiveBillingAddressController)
  .get("/billingaddress/:id", getBillingAddressByIdController)
  .delete("/billingaddress/:id", deleteBillingAddressController);

// product reviews
router
  .post("/review", addReviewConttroller)
  .patch("/review/:id", updateReviewController)
  .get("/review", getReviewController)
  .get("/review/:noofreviews", getReviewController)
  .get("/review/:noofreviews/:pagenumber", getReviewController)
  .get("/review/product/:pid", getReviewByProductIdController)
  .delete("/review/:id", deleteReviewController);

// brands
router
  .post("/brand", uploadBrandImage, addBrandController)
  .patch("/brand", uploadBrandImage, updateBrandController)
  .get("/brand", getBrandController)
  .get("brand/:id", getBrandByIdController)
  .delete("/brand/:id", deleteBrandController);

//room-make-over
router
  .post("/room-make-over")
  .patch("/room-make-over/:type")
  .get("/room-make-over/:type");

// slider
router
  .post("/slider", uploadSliderImage, addSliderImageController)
  .get("/slider", getSliderImageController)
  .delete("/slider/:id", deleteSliderImageController);

// hobbies list (design by your hobbies)
router
  .post("/hobbies", uploadHobbieImages, addHobbieController)
  .patch("/hobbies/:id", uploadHobbieImages, updateHobbieController)
  .get("/hobbie", getHobbieController)
  .get('/hobbie/product/:title', getHobbieProductByTitleController)
  .get("/hobbie/:name", getHobbieByNameController)
  .delete("/hobbies/:id", deleteHobbieController);

// banners
router
  .post("/banner", uploadBannerImage, addBannerController)
  .patch("/banner/:type", uploadBannerImage, updateBannerController)
  .get("/banner", getBannerController)
  .get("/banner/:type", getBannerByTypeController)
  .delete("/banner/:id", deleteBannerController);

// our community products for users
router
  .post("/community", addCommunityImages, addCommunityPostController)
  .patch("/community/:id", addCommunityImages, updateCommunityPostController)
  .get("/community", getCommunityPostController)
  .get("/community/client/:noofpage", getCommunityPostController)
  .get("/community/client/:noofpage/:pagenumber", getCommunityPostController)
  .get("/community/tablename/:colname/:value", getCommunityPostByTableNameController)
  .get("/community/user/tablename/:colname/:value", getCommunityPostByTableNameController)
  .get("/community/user", getCommunityPostController)
  .get("/community/user/:noofpage", getCommunityPostController)
  .get("/community/user/:noofpage/:pagenumber", getCommunityPostController)
  .delete("/community/:id", deleteCommunityPostController);

// get share product for 
router
  .get('/share-product/user', getShareProductForUserController)
  .get("/share-product/user/:id", getShareProductByIdController)
  .get('/share-product/image/:pid', getShareProductImagesController)
  .get('/share-product/:title', getShareProductByTitleController)
  .get("/share-product", getShareProductController)
  .post("/share-product", uploadShareProduct, addShareProductController)
  .patch("/share-product/:id", uploadShareProduct, updateShareProductController)
  .delete('/share-product/image/:id', deleteShareProductImageByIdController)
  .delete("/share-product/:id", deleteShareProductController)

module.exports = router;
