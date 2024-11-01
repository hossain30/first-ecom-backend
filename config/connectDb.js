const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://badsha:badsha@cluster0.fb2hw.mongodb.net/Acommerce?retryWrites=true&w=majority"
    );

  } catch (error) {

  }
};

module.exports = connectDb;
