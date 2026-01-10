// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");

// Multer pour stockage temporaire
const upload = multer({ dest: "temp/" });

router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.get("/", getProducts);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
