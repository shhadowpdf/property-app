const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs/promises')

const logs = async (req, res, next) =>{
    fs.appendFile(path.join(__dirname,'..','logs.txt'),`Time: ${Date.now()} \n`)
    next()
}
router.use(logs)

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '..','public', 'Home Page', 'home.html'))
})

module.exports = router