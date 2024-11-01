const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/jwtMiddleware");
const CategoryClass = require("../controller/categoryController");
const routes = express.Router();

//create new category
routes.post(
  "/create-category",
  verifyToken,
  isAdmin,
  CategoryClass.createCategoryController
);

//get all categories
routes.get("/get-all-category", CategoryClass.getAllCat);

//update category
routes.put(
  "/update-category/:cid",
  verifyToken,
  isAdmin,
  CategoryClass.updateCategoryController
);
//delete category
routes.delete(
  "/delete-category/:cid",
  verifyToken,
  isAdmin,
  CategoryClass.deleteCategoryController
);

module.exports = routes;
