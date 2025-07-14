const express = require("express");
const router = express.Router();
const path = require('path')
const fs = require('fs')
const Agents = require('../models/agentData.js')


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Login', 'login.html'))
});

router.post('/agentLoginData', async (req, res) => {
    const { username, password } = req.body;
    try {
        const agents = await Agents.findOne({username,password});
        if (agents) {
            req.session.agentLoggedIn="true";
            req.session.agentCurrentlyLoggedIn=agents.username;
            console.log("login successful", req.session)
            res.json({ success: true, message: "Login successful", agents: agents.username });

        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to fetch agents" })
    }
});

module.exports = router