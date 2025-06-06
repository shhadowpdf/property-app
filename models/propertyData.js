const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
    number: Number,
    type: String,
    bedrooms: String,
    furnished: Boolean,
    locality: String,
    sqfeet: Number,
    totalprice: String,
    availableon: String,
    ownername: String,
    mobileno: Number,
    address: String,
    addedon: {
        type: String, default: () => {
            return new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true
            });

        }
    },
    stillavailable: { type: Boolean, default: true },
    addedby: String
});

module.exports = mongoose.model("Property", propertySchema);

