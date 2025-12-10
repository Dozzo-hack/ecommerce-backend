const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la catégorie est requis"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model("Category", categorySchema);
