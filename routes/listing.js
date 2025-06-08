const express = require('express')
const path = require('path')
const fsp = require('fs/promises')
const fs = require('fs')
const router = express.Router();
const Property = require('../models/propertyData.js')
const VisitLog = require('../models/vistData.js')
router.use(async (req, res, next) => {
    if (req.path === '/') {
    try {
        const log = new VisitLog({
            ip: req.socket?.remoteAddress || "Unk",
            route: req.originalUrl,
            method: req.method
        });

        await log.save();
        console.log("Visit logged:", log);
    } catch (err) {
        console.error("Failed to log visit", err);
    }
  }
    next();
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','public', 'Listing', 'listing.html'))
}
);
router.get('/all-property',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','All Properties', 'all.html'))
})
router.get('/add-property',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public', 'Add Page', 'add.html'))
})
router.post('/add-property', async (req,res)=> {
    try{
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(200).json({message: 'Property Added Successfully.'})
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Failed to add property.'})
    }
})

router.get('/property-count', async (req,res)=>{
    try{
        const count = await Property.countDocuments({});
        res.json({count});
    }catch(err){
        res.status(500).json({error: 'Failed to get count'})
    }
});
router.get('/fetch-property', async (req, res) => {
    try {
        const properties = await Property.find({},{
            number: 1,
            type:1,
            bedrooms:1,
            furnished:1,
            locality:1,
            sqfeet:1,
            totalprice:1,
            availableon:1,
            stillavailable:1
        });
        res.json(properties);
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});
router.get('/fetch-property-private', async (req, res) => {
    if (!req.session.agentLoggedIn) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        console.error("Error fetching private properties:", err);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});
router.put('/mark-sold/:id', async(req,res)=>{
    const propertyId = req.params.id;
    try{
        const result = await Property.updateOne(
            {_id: propertyId},
            {$set: {stillavailable: false}}
        );
        if(result.modifiedCount > 0){
            res.status(200).json({message: 'Property marked as sold.'})
        }else{
            res.status(404).json({message: "Sold or not available"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: `It's not you its us`})
    }
});
router.get('/fetch-property/:id', async (req,res)=> {
    if (!req.session.agentLoggedIn) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    try{
        const propertyId = req.params.id;
        const result = await Property.findById(propertyId);
        res.json(result);
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: `Backend error`})
    }
});
router.get('/edit-property/:id', (req,res)=> {
    if(!req.session.agentLoggedIn){
        return res.status(403).json({error: "Unauthorized"});
    }
    else{
        res.sendFile(path.join(__dirname,'..','public', 'Edit Page', 'edit.html'));
    }
})

router.put('/edit-property/:id', async (req,res)=> {
    if(!req.session.agentLoggedIn){
        return res.status(403).json({error: "Unauthorized"});
    }
    try{
        const propertyId = req.params.id;
        await Property.findByIdAndUpdate(propertyId, req.body);
        res.json({message: "Property updated successfully."})
    }catch(err){
        res.status(500).json({error: "Update failed"});
        console.log(err);
        
    }
})

module.exports = router