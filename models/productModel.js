const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, lowercase: true },
    category: { type: mongoose.ObjectId, ref: "category",  },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: String, required: true },
    photo: { data: Buffer, contentType: String },
    shipping: {
      type: Boolean,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
