require('dotenv').config()
const mongoose = require('mongoose')
const agent = require("./models/agentData");
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("CONNECTED"));
const Agent = new agent({
    username: "mukku9669",
    password: "1309"
});
Agent.save().then(()=> console.log("Done"))