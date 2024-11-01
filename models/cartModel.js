const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.ObjectId, required: true, ref: "product" },
    userId: { type: mongoose.ObjectId, required: true, ref: "User" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
