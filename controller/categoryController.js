const CategoryModel = require("../models/categoryModel");
const slug = require("slug");
class CategoryClass {
  //create category
  static createCategoryController = async (req, res) => {


    try {
      const { name } = req.body;

      if (name) {
        const createProduct = await new CategoryModel({
          name,
          slug: slug(name), //start from here
        }).save();
       

        return res.status(201).send({
          success: true,
          message: "Successfully created category",
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //get all category
  static getAllCat = async (req, res) => {
    try {
      const createProduct = await CategoryModel.find({}).sort({
        createdAt: -1,
      });

      return res.status(200).send({
        success: true,
        categories: createProduct,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //update category
  static updateCategoryController = async (req, res) => {
    try {
      const response = await CategoryModel.findByIdAndUpdate(
        req.params.cid,
        {
          $set: { name: req.body.name, slug: slug(req.body.name) },
        },
        { new: true }
      );

      return res.status(201).send({
        success: true,
        message: "Updated successfully",
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //update category
  static deleteCategoryController = async (req, res) => {
    try {
      const response = await CategoryModel.findByIdAndDelete(req.params.cid);

      return res.status(201).send({
        success: true,
        message: "deleted successfully",
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = CategoryClass;
