const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    number: Number,
    type: String,
    bedrooms: String,
    furnished: Boolean,
    locality: String,
    sqfeet: Number,
    totalprice: Number,
    availableon: String,
    ownername: String,
    mobileno: Number,
    address: String,
    addedon: {type: String, default: new Date(Date.now()).toString()},
    stillavailable: {type: Boolean, default: true},
    addedby: String
});

module.exports = mongoose.model("Property", propertySchema);

