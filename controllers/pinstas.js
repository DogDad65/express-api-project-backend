const express = require("express");
const router = express.Router();

const { Post: PinstaModel } = require("../models/pinsta");

router.post("/", async function (req, res) {
    try {
        // res.json({ message: "create route" });
        // console.log(req.body);
        // console.log(req.user);
        req.body.author_id = req.user._id;

        const userPinstaDoc = await PinstaModel.create(req.body);
        userPinstaDoc._doc.author = req.user;

        res.status(201).json(userPinstaDoc);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/:pinstaId", async function (req, res) {
    try {
        // res.json({ message: "Hitting the update route" });
        const userPinstaDoc = await PinstaModel.findOne({ author_id: req.user._id, _id: req.params.pinstaId });
        // console.log(userPinstaDoc);

        if (!userPinstaDoc) {
            res.status(403).json({
                message: "You are not allowed to update a pinsta"
            });
        };

        const updatedPinsta = await PinstaModel.findByIdAndUpdate(req.params.pinstaId, req.body, { new: true });
        // console.log(updatedPinsta);

        updatedPinsta._doc.author_id = req.user;

        res.status(200).json(updatedPinsta);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:pinstaId", async function (req, res) {
    try {
        // res.json({ message: "Delete Route" });

        const userPinstaDoc = await PinstaModel.findById(req.params.pinstaId);
        // console.log(pinstaDoc);
        if (!userPinstaDoc.author_id.equals(req.user._id)) {
            res.status(403).json({
                message: "You are not allowed to delete a pinsta"
            });
        };

        const deletedUserPinsta = await PinstaModel.findByIdAndDelete(req.params.pinstaId);
        // console.log(deletedUserPinsta);

        res.status(200).json({ message: "Item was successfully deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;