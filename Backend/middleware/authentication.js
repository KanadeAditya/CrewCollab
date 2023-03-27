const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {blacklist} = require('../model/blacklisted.js')
require("dotenv").config();
// var  {reft}= require('../blacklist.js');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const authenticator = async (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        let black  = await blacklist.find({token})
        if(black.length){
            res.send({msg:"Please Login Again"})
        }else{
            try {
                jwt.verify(token, process.env.normalKey ,async (err,decoded)=>{
                    if(err){
                        res.send({"msg":err});
                    }else{
                        req.body.userID = decoded.userID;
                        req.body.email = decoded.email
                        req.body.name = decoded.name
                        req.body.time = Date.now()
                        next()
                    }
                });
            } catch (error) {
                res.send({"msg":error.message})
            }
        }
    }else{
        res.send({"msg":"please login first"})
    }
}

module.exports = {authenticator}