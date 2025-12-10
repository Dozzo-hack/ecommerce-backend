const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes protégées par rôle admin
router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
