// controllers/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");

const SALT_LENGTH = 12;

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(409).json({ error: "Username already taken." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_LENGTH);
    const user = await User.create({ username: req.body.username, hashedPassword });
    const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ user: { _id: user._id, username: user.username }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.hashedPassword))) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Route
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    // Hash the password if it's being updated
    if (updates.password) {
      updates.hashedPassword = await bcrypt.hash(updates.password, SALT_LENGTH);
      delete updates.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User Route
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
