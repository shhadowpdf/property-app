const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    number: Number,
    name: String,
    email: String,
    phone: String,
    contacted: {type: Boolean, default: false},
    date: {type: String, default: new Date(Date.now()).toString()},
});

module.exports = mongoose.model("ContactUs", contactSchema);