const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    number: Number,
    name: String,
    email: String,
    phone: String,
    contacted: {type: Boolean, default: false},
    date: {type: String, default: () => {
            return new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true
            });
        }
    }
});

module.exports = mongoose.model("ContactUs", contactSchema);