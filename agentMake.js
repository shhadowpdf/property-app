require('dotenv').config()
const mongoose = require('mongoose')
const agent = require("./models/agentData");
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("CONNECTED"));
const Agent = new agent({
    username: "",
    password: ""
});
Agent.save().then(()=> console.log("Done"))