const express = require('express')
const path = require('path')
const router = express.Router();
const Contact = require('../models/contactusData.js');



router.post('/', async (req, res) =>{
    try{
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(200).json({message: "Form submitted successfully."});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to submit form."})
    }
});
router.get('/contactusers',(req,res)=>{
    if (!req.session.agentLoggedIn) {
        res.send("NOT FOR YOU")
    }else{
        res.sendFile(path.join(__dirname,'..','public','Contact Users','contact.html'))
    }
router.get('/fetch-users', async (req, res) => {
    if (!req.session.agentLoggedIn) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const users = await Contact.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users", err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
});
router.get('/user-count', async (req,res)=>{
    try{
        const count = await Contact.countDocuments({});
        res.json({count});
    }catch(err){
        res.status(500).json({error: 'Failed to get count'})
    }
});

module.exports = router