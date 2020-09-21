'use strict'
const express= require("express")
const app = express();
const bodyParser = require("body-parser")

var Biblioteca_routes=require('./src/routes/route')


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY,Origin,X-Requested-Whith,Content-Type,Accept,Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE')
    res.header('Allow','GET,POST, OPTIONS, PUT ,DELETE')
    next();
})
app.use('/api',Biblioteca_routes)

module.exports=app;