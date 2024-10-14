const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { Post: Pinsta } = require("../models/pinsta");
const verifyToken = require("../middleware/verify-token");

// GET - Show Profile with User's Posts
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Check if the user is authorized to view this profile
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch the user profile along with related posts
    const user = await User.findById(req.user._id).populate("posts");
    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }

    res.json({ user });
  } catch (error) {
    if (error.message === "Profile not found.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
