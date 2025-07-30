const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/register", async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
    }catch(error){
        res.status(400).json({message: "Error registering user"})
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({message: "Invalid credentials"});

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({message: "Invalid credentials"});

    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({token});
});

module.exports = router;
