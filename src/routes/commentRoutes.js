const express = require('express');
const Comment = require('../models/Comment');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/", protect, async (req, res) => {
    const comment = await Comment.create({...req.body, author: req.user.id});
    res.status(201).json(comment);
});

router.get("/:postId", async (req, res) => {
    const comments = await Comment.find({post: req.params.postId}).populate("author", "username");
    res.json(comments)
});

module.exports = router;