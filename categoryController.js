// controllers/categoryController.js
const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Cette catégorie existe déjà." });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création.", error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement.", error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour.", error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error });
  }
};
