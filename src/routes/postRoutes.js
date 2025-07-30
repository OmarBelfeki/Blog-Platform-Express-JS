const express = require("express");
const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
    const post = await Post.create({ ...req.body, author: req.user.id });
    res.status(201).json(post);
});

router.get("/", async (req, res) => {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
});

router.put("/:id", protect, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: "Post not found"});
    if(post.author.toString() !== req.user.id) return res.status(403).json({message: "Not authorized"});

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updated);
});

router.delete("/:id", protect, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message: "Post not found"});
    if(post.author.toString() !== req.user.id) return res.status(403).json({message: "Not authorized"});

    await post.deleteOne();
    res.json({message: "Post deleted"});
});

module.exports = router;
