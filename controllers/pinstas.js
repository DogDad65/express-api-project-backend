const express = require('express');
const router = express.Router();
const { Pinsta, Comment } = require('../models/pinsta');

router.get('/', async (req, res) => {
    try {
        const pinstaDocs = await Pinsta.find({}).populate('author_id', 'username')
        res.status(200).json(pinstaDocs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/pinstaId', async (req, res) => {
    try {
        const pinstaDocs = await Pinsta.findById(req.params.pinstaId)
        .populate('author_id', 'username', 'comments')
        if (!pinstaDocs) {
            return res.status(404).json({ error: 'Pinsta not found' });
        }
        res.status(200).json(pinstaDocs);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/:pinstaId/comments', async (req, res) => {
    try {
        const pinstaDocs = await Pinsta.findById(req.params.pinstaId);
        if(!pinstaDocs) {
            return res.status(404).json({  error: 'Pinsta not found'});
        }
        const newComment = new Comment({
            author_id: req.user._id,
            commentDetails: req.body.commentDetails,
            post: req.params.pinstaId
        })
        await newComment.save();

        Pinsta.comments.push(newComment);
        await pinstaDocs.save();
        res.status(200).json(newComment);
    
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})




module.exports = router;