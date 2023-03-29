const jwt = require("jsonwebtoken");
require("dotenv").config();
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//////////////////////////////////

const redis=require('redis');
const client=redis.createClient({url: process.env.redisURL});
client.on('error', err => console.log('Redis Client Error', err));

(async function connecting(){
    await client.connect();
})()
////////////////////////////////

const authenticator = async (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        let black= await client.SISMEMBER('blackTokens', token);
        if(black){
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