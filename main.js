require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session')
const port = 3000;
const path = require('path');

const home = require('./routes/home.js');
const listing = require('./routes/listing.js');
const login = require('./routes/login.js');
const contactus = require('./routes/contactus.js');

const mongoose = require('mongoose');
app.use(session({
  secret: process.env.MYSECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,// true only with HTTPS
    maxAge: 60*10*1000 //10mins
  } 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', home);
app.use('/home', home);
app.use('/listing', listing);
app.use('/agentlogin', login);
app.use('/contactus',contactus)

app.get('/permission-check', async (req,res)=>{
    res.json({
      currentLoggedIn: req.session.agentCurrentlyLoggedIn || null,
      ifLoggedIn: req.session.agentLoggedIn || null
    })
})

app.post('/logout',(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true, message: "Logged Out" });
  });

});


app.listen(port, () => {
  console.log(`Example app listening on localhost:${port} `)
});



mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("CONNECTED SUCCESSFULLY TO DATABASE");
})

