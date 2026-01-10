// controllers/productController.js

const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ==========================
// CREATE PRODUCT
// ==========================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "myshop/products",
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;

      // Supprimer fichier temporaire
      fs.unlinkSync(req.file.path);
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: imageUrl,
      imagePublicId,
    });

    res.status(201).json({ message: "Produit créé avec succès", product });
  } catch (err) {
    console.error("Erreur création produit:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==========================
// GET PRODUCTS (FILTER + SEARCH)
// ==========================
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (err) {
    console.error("Erreur getProducts:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    const { name, price, description, category } = req.body;

    if (req.file) {
      // Supprimer ancienne image Cloudinary
      if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "myshop/products",
      });

      product.image = result.secure_url;
      product.imagePublicId = result.public_id;

      fs.unlinkSync(req.file.path);
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.category = category ?? product.category;

    await product.save();

    res.json({ message: "Produit mis à jour", product });
  } catch (err) {
    console.error("Erreur updateProduct:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();

    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteProduct:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
