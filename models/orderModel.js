const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [{}],
    payment: {},
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "shipped", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
