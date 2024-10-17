const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:userId", async (req, res) => {
  try {

    const user = await User.findById(req.params.userId).populate("posts");
    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }
<<<<<<< HEAD
=======
    // Fetch user's posts
    // const userPosts = await Pinsta.find({ author_id: req.user._id });

>>>>>>> test1
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
