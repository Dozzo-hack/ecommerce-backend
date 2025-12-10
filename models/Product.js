const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
      required: false, // obligatoire si tu veux
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

