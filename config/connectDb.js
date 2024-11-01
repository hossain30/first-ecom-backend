const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/dcommerce");
    console.log("db connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
