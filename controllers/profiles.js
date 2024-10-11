const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { Post: Pinsta } = require("../models/pinsta");
const verifyToken = require("../middleware/verify-token");

// GET - Show Profile with User's Posts
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch the user profile
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }
    // Fetch user’s posts
    const userPosts = await Pinsta.find({ userId: req.user._id });

    res.json({ user, posts: userPosts });
  } catch (error) {
    if (error.message === "Profile not found.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
