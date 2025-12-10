const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================
// INSCRIPTION UTILISATEUR
// =====================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Cet email existe déjà" });

    const user = await User.create({
      name,
      email,
      password,     // le pre-save du modèle va hash automatiquement
      role: "user"
    });

    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =====================
// CONNEXION UTILISATEUR
// =====================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "30d" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ROUTE TEMPORAIRE pour créer l'admin
// POST http://localhost:5000/api/auth/create-admin
exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifie si l'admin existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin déjà créé" });
    }

    // Crée l'admin comme un user normal
    const admin = await User.create({
      name,
      email,
      password,   // le hook pre-save de bcrypt va hash automatiquement
      role: "admin"
    });

    res.status(201).json({ message: "Admin créé !", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création admin" });
  }
};
