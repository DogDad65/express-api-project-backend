const express = require("express");
const router = express.Router();

const { Post: Pinsta } = require("../models/pinsta");
const User = require("../models/user");

const verifyToken = require("../middleware/verify-token");
const upload = require("../middleware/upload-photo");


router.get("/", async (req, res) => {
    try {
        const pinstaDocs = await Pinsta.find({}).populate("author_id", "username");

        res.status(200).json(pinstaDocs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:pinstaId", async (req, res) => {
    try {
        const pinstaDoc = await Pinsta.findById(req.params.pinstaId)
            .populate("author_id", "username")
            .populate("comments.author_id", "username");
        if (!pinstaDoc) {
            return res.status(404).json({ error: "Pinsta not found" });
        }
        res.status(200).json(pinstaDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:pinstaId/comments", verifyToken, async (req, res) => {
    try {
        const pinstaDoc = await Pinsta.findById(req.params.pinstaId);
        if (!pinstaDoc) {
            return res.status(404).json({ error: "Pinsta not found" });
        }
        const newComment = {
            author_id: req.user._id,
            commentDetails: req.body.commentDetails,
        };

        pinstaDoc.comments.push(newComment); //Switched from .push(req.body)
        await pinstaDoc.save();

        const updatedPost = await Pinsta.findById(req.params.pinstaId)
            .populate("author_id", "username")
            .populate("comments.author_id", "username")
            .populate("likes.author_id", "username");

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/", verifyToken, upload.single('photos'), async function (req, res) {
    try {

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        req.body.photos = imageUrl;

        req.body.author_id = req.user._id;

        const userPinstaDoc = await Pinsta.create(req.body);

        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { posts: userPinstaDoc._id } },
            { new: true }
        );

        userPinstaDoc._doc.author = req.user;

        res.status(201).json(userPinstaDoc);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/:pinstaId", verifyToken, upload.single('photos'), async function (req, res) {
    try {

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        if (imageUrl) {
            req.body.photos = imageUrl;
        }

        const userPinstaDoc = await Pinsta.findOne({ author_id: req.user._id, _id: req.params.pinstaId });

        if (!userPinstaDoc) {
            res.status(403).json({
                message: "You are not allowed to update a pinsta"
            });
        };

        const updatedPinsta = await Pinsta.findByIdAndUpdate(req.params.pinstaId, req.body, { new: true });

        updatedPinsta._doc.author_id = req.user;

        res.status(200).json(updatedPinsta);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:pinstaId", verifyToken, async function (req, res) {
    try {

        const userPinstaDoc = await Pinsta.findById(req.params.pinstaId);
        if (!userPinstaDoc.author_id.equals(req.user._id)) {
            return res.status(403).json({
                message: "You are not allowed to delete a pinsta"
            });
        };

        const deletedUserPinsta = await Pinsta.findByIdAndDelete(req.params.pinstaId);

        res.status(200).json({ message: "Item was successfully deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
