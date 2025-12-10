// controllers/productController.js

const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ==========================
// CREATE PRODUCT
// ==========================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: imagePath,
    });

    res.status(201).json({ message: "Produit créé avec succès", product });
  } catch (err) {
    console.error("Erreur création produit:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ==========================
// GET ALL PRODUCTS
// ==========================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    console.error("Erreur getProducts:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Produit introuvable" });

    // Suppression de l'ancienne image si une nouvelle a été fournie
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join("uploads", product.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      product.image = req.file.filename;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    await product.save();

    res.json({ message: "Produit mis à jour", product });

  } catch (err) {
    console.error("Erreur updateProduct:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Produit introuvable" });

    // Delete product image
    if (product.image) {
      const imagePath = path.join("uploads", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();

    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteProduct:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
