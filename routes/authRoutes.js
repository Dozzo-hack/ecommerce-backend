const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { createAdminUser } = require('../controllers/authController');

// Route temporaire
router.post('/create-admin', createAdminUser);


router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
