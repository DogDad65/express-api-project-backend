const express = require("express");
const router = express.Router();
const { Post: PinstaModel } = require("../models/pinsta");
const verifyToken = require("../middleware/verify-token");

router.get("/", async function (req, res) {
  try {
    const posts = await PinstaModel.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrieve a specific Pinsta by ID
router.get("/:pinstaId", async function (req, res) {
  try {
    const post = await PinstaModel.findById(req.params.pinstaId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Create a new Pinsta
router.post("/", verifyToken, async function (req, res) {
  try {
    req.body.author_id = req.user._id; // Assign logged-in user as author
    const userPinstaDoc = await PinstaModel.create(req.body);
    userPinstaDoc._doc.author = req.user; // Attach user info to response
    res.status(201).json(userPinstaDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update an existing Pinsta
router.put("/:pinstaId", verifyToken, async function (req, res) {
  try {
    const userPinstaDoc = await PinstaModel.findOne({
      author_id: req.user._id,
      _id: req.params.pinstaId,
    });
    if (!userPinstaDoc) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this pinsta" });
    }

    const updatedPinsta = await PinstaModel.findByIdAndUpdate(
      req.params.pinstaId,
      req.body,
      { new: true }
    );
    updatedPinsta._doc.author_id = req.user;
    res.status(200).json(updatedPinsta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete an existing Pinsta
router.delete("/:pinstaId", verifyToken, async function (req, res) {
  try {
    const userPinstaDoc = await PinstaModel.findById(req.params.pinstaId);
    if (!userPinstaDoc || !userPinstaDoc.author_id.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this pinsta" });
    }

    await PinstaModel.findByIdAndDelete(req.params.pinstaId);
    res.status(200).json({ message: "Item was successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
