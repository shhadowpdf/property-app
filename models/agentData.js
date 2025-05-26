const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    username: String,
    password: String,
    userRegisteredOn: { type: String, default: new Date(Date.now()).toString() },
});

module.exports = mongoose.model("Agent",agentSchema);