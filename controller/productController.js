const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const UserModel = require("../models/authModel");
const slug = require("slug");
const fs = require("fs");
const braintree = require("braintree");

///////create payment gateway
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "ggdph44kyq92wvsq",
  privateKey: "9ff6a658afbc5a9ac4eccc816935c839",
  publicKey: "yf43ptpx6qqvvv5r",
});

class ProductClass {
  ////create product
  static createProductController = async (req, res) => {
    try {
      const { name, category, description, price, quantity, shipping } =
        req.fields;
      const { photo } = req.files;

      if (
        !name ||
        !category ||
        !description ||
        !price ||
        !quantity ||
        !shipping ||
        !photo
      ) {
        return res
          .status(400)
          .status({ success: false, message: "All fields are required" });
      } else {
        let response = new ProductModel({
          ...req.fields,
          slug: slug(name),
        });
        response.photo.data = fs.readFileSync(photo.path);
        response.photo.contentType = photo.type;
        response = await response.save();

        return res.status(201).send({
          success: true,
          message: "Successfully created product",
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  /////get product's photo
  static getProductPhoto = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await ProductModel.findById(pid).select("photo");
      if (product?.photo?.data) {
        res.set("Content-Type", product.photo.data.contentType);
        return res.send(product.photo.data);
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //get all products
  static getAllProducts = async (req, res) => {
    try {
      const products = await ProductModel.find({})
        .sort({
          createdAt: -1,
        })
        .select("-photo")
        .populate("category");

      return res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //get single product
  static getSingleProduct = async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await ProductModel.findById(pid)

        .select("-photo")
        .populate("category");

      return res.status(200).send({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //get products by category
  static getProductsByCat = async (req, res) => {
    try {
      const products = await ProductModel.find({
        category: req.params.cid,
      })
        .select("-photo")
        .populate("category")
        .sort({ createdAt: -1 });

      return res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //get products by filter,price and category
  static getProductsByFilter = async (req, res) => {
    const { radio, check } = req?.body;

    let args = {};
    if (radio.length >= 1) args.price = { $gte: radio[0], $lte: radio[1] };
    if (check.length >= 1) args.category = check;

    try {
      const products = await ProductModel.find(args)
        .select("-photo")
        .populate("category")
        .sort({ createdAt: -1 });

      return res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //get similer products
  static getSimilerProduct = async (req, res) => {
    const { pid, cid } = req?.params;

    try {
      const products = await ProductModel.find({
        category: cid,
        _id: { $ne: pid },
      })
        .select("-photo")
        .sort({ createdAt: -1 })
        .populate("category");

      return res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //search products
  static searchProducts = async (req, res) => {
    try {
      const { keywords } = req.params;

      let searchedProducts = await ProductModel.find({
        $or: [
          { name: { $regex: keywords, $options: "i" } },
          { description: { $regex: keywords, $options: "i" } },
        ],
      }).select("-photo");

      return res.status(200).send({
        success: true,
        searchedProducts,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //update product products
  static updateProduct = async (req, res) => {
    try {
      const { name, category, description, price, quantity, shipping } =
        req.fields;
      const { photo } = req.files;

      let updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.pid,
        {
          $set: { name, category, description, price, quantity, shipping },
        },
        { new: true }
      ).select("-photo");

      if (photo) {
        updatedProduct.photo.data = fs.readFileSync(photo.path);
        updatedProduct.photo.contentType = photo.type;
        updatedProduct = await updatedProduct.save();

        return res.status(201).send({
          success: true,
          message: "Successfully updated product",
          updatedProduct,
        });
      }
      return res.status(201).send({
        success: true,
        message: "Successfully updated product",
        updatedProduct,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  ////total products count in db for loading more button
  static totalDocCount = async (req, res) => {
    try {
      const totalDoc = await ProductModel.find({}).estimatedDocumentCount();

      return res.status(200).send({
        success: true,
        totalDoc,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  ////get product by tapping loadmore button in client
  //per page will be 6 products
  static loadMoreProducts = async (req, res) => {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    try {
      const products = await ProductModel.find({})
        .populate("category")
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(6)
        .sort({ createdAt: -1 });

      return res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //add to cart
  static addToCart = async (req, res) => {
    const { pid } = req.query;
    const uid = req.userId;

    try {
      const product = await new CartModel({
        productId: pid,
        userId: uid,
      }).save();

      if (product) {
        return res.status(201).send({
          success: true,
          message: "Cart successfully added",
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //get from cart
  static getFromCart = async (req, res) => {
    const uid = req.userId;

    try {
      const products = await CartModel.find({ userId: uid }).populate({
        path: "productId",
        select: "-photo",
      });

      if (products) {
        return res.status(200).send({
          success: true,
          products,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  //delete from cart
  static deleteFromCart = async (req, res) => {
    const uid = req.userId;
    const { cartId } = req.query;

    try {
      const deletedProduct = await CartModel.deleteOne({
        $and: [{ userId: uid }, { _id: cartId }],
      });

      if (deletedProduct) {
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //delete full cart
  static deleteFullProduct = async (req, res) => {
    try {
      const deletedProduct = await CartModel.deleteMany();

      if (deletedProduct) {
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  ////////////////////this is for payments only/////////////
  //get client token
  static braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, (err, response) => {
        if (!err) {
          return res.send(response);
        } else {
          return res.status(400).send({
            success: false,
            err,
          });
        }
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  //payment
  static braintreePaymentController = async (req, res) => {
    const { cart, nonce } = req.body;


    let total = 0;
    cart.map((p) => (total += p?.productId?.price));
    try {
      const newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: { submitForSettlement: true },
        },
        async function (err, result) {
          if (result) {
            await new OrderModel({
              products: cart,
              payment: result,
              buyer: req.userId,
            }).save();
            return res.status(200).send({
              success: true,
            });
          } else {
            return res.status(400).send({
              success: false,
              err,
            });
          }
        }
      );
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  ////get full order after successfully bought(USERS)
  static getFullOrders = async (req, res) => {
    try {
      const orders = await OrderModel.find({ buyer: req.userId }).select(
        " -__v"
      );

      if (orders) {
        return res.status(200).send({
          success: true,
          orders,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  ////get full order after successfully bought(ADMIN)
  static getFullOrdersAdmin = async (req, res) => {
    try {
      const orders = await OrderModel.find().select(" -__v");

      if (orders) {
        return res.status(200).send({
          success: true,
          orders,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
  ////update status
  static updateStatus = async (req, res) => {
    const { oid, status } = req.query;
    try {
      const response = await OrderModel.findByIdAndUpdate(oid, { status });
      

      if (response) {
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

}

module.exports = ProductClass;
