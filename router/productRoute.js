const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/jwtMiddleware");
const ProductClass = require("../controller/productController");
const routes = express.Router();
const formidable = require("express-formidable");

//create new product
routes.post(
  "/create-product",
  verifyToken,
  isAdmin,
  formidable(),
  ProductClass.createProductController
);
/////get product's photo
routes.get(
  "/product-photo/:pid",

  ProductClass.getProductPhoto
);
//get all products
routes.get("/get-all-products", ProductClass.getAllProducts);
//get single product
routes.get("/get-single-product/:pid", ProductClass.getSingleProduct);
//get  products by category
routes.get("/products-by-cat/:cid", ProductClass.getProductsByCat);
//get  products by filter,price and category
routes.post("/get-products-by-filter", ProductClass.getProductsByFilter);
//get similer products
routes.get("/get-similer-products/:pid/:cid", ProductClass.getSimilerProduct);
//update product
routes.put(
  "/update-product/:pid",
  verifyToken,
  isAdmin,
  formidable(),
  ProductClass.updateProduct
);
//search products
routes.get("/search-products/:keywords", ProductClass.searchProducts);
////total products count in db for loading more button
routes.get("/total-doc", ProductClass.totalDocCount);
////get product by tapping loadmore button in client
//per page will be 6 products
routes.get("/product-list/:page", ProductClass.loadMoreProducts);
/////////add to cart
routes.get("/add-to-cart", verifyToken, ProductClass.addToCart);
/////////get  cart
routes.get("/get-from-cart", verifyToken, ProductClass.getFromCart);
////////delete product from cart
routes.delete("/delete-from-cart", verifyToken, ProductClass.deleteFromCart);
////////delete  full cart
routes.delete(
  "/delete-from-cart-all",
  verifyToken,
  ProductClass.deleteFullProduct
);
///////////////for payment gateway///////////
routes.get(
  "/braintree/token",
  verifyToken,
  ProductClass.braintreeTokenController
);
routes.post(
  "/braintree/payment",
  verifyToken,
  ProductClass.braintreePaymentController
);
///////////////////////////////
///get full orders after succesfully purchased
//this is only for users
routes.get("/orders", verifyToken, ProductClass.getFullOrders);
///get full orders after succesfully purchased
//this is only for ADMIN
routes.get(
  "/admin-orders",
  verifyToken,
  isAdmin,
  ProductClass.getFullOrdersAdmin
);
///update status
routes.put("/status", verifyToken, isAdmin, ProductClass.updateStatus);
module.exports = routes; 
