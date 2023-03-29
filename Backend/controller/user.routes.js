const express = require("express");
const mongoose = require("mongoose")
const usersRoute = express.Router();
const {UserModel} =require("../model/user.model.js");
const {blacklist} = require('../model/blacklisted.js');
// var  {reft}= require('../blacklist.js');
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken")
const {authenticator} = require("../middleware/authentication.js");


usersRoute.get("/",(req,res)=>{
    res.send("working")
})

usersRoute.post("/signup",async (req,res)=>{
    let {name,email,password} = req.body;

    if(!name || !email || !password){
        res.send({"msg":"Provide all the details"});
    }
    try {
        bcrypt.hash(password, 5 ,async (err, hash)=>{
            // Store hash in your password DB.
            if(err){
                res.send({"msg":err})
            }else{
                let ifexist = await UserModel.find({email:email});
                if(ifexist.length){
                    res.send({"msg":"Account already Registered with this email Please login","emailexists":true});
                }else{
                    const newuser = new UserModel({name,email,password:hash});
                    await newuser.save();
                    res.send({"msg":"User Registered"});
                }
            }
        });
    } catch (error) {
        res.send({"msg":error.message})
    }
}) 

usersRoute.post("/login",async (req,res)=>{
    let {email,password} = req.body;
    // console.log(email,password)
    try {
        const user = await UserModel.find({email});
        if(user.length!==0){
            bcrypt.compare(password, user[0].password, (err, result)=>{
                // result == true
                if(err){
                    res.send({"msg": err})
                }else{
                    if(result){
                        // console.log(user[0]._id)
                        let token = jwt.sign({userID:user[0]._id ,email , name : user[0].name},process.env.normalKey,{expiresIn:60*60});
                        let refreshtoken = jwt.sign({userID:user[0]._id ,email , name : user[0].name},process.env.refreshkey,{expiresIn:60*60*60});
                        // reft.refreshToken = refreshtoken;
                        // console.log(req.cookies)
                        res.cookie("refreshToken",refreshtoken);
                        res.send({msg:"user logged in",token,refreshtoken})
                    }else{
                        res.send({msg:"Wrong password"})
                    }
                }
            });
        }else{
            res.send({msg:"wrong email"})
        }
    } catch (error) {
        res.send({"msg":error.message})
    }
})

usersRoute.get("/logout",(req,res)=>{
    try {
        let token = req.headers.authorization.split(" ")[0];
        let refreshtoken = req.headers.authorization.split(" ")[1];
        let black = new blacklist({token,refreshtoken});
        black.save();
        res.send({msg:"Log out successfull"})
    } catch (error) {
        res.send({"msg":error.message})
    }
})

usersRoute.get("/refreshtoken",authenticator,async (req,res)=>{
    try {
        let refreshtoken = req.headers.authorization;
        if(refreshtoken){
            let ifexist = await blacklist.find({refreshtoken});
            
            if(ifexist.length){
                res.send({msg:"Please Login Again "});
            }else{
                jwt.verify(refreshtoken, process.env.refreshkey,(err,decoded)=>{
                    if(err){
                        res.send({"msg":err})
                    }else{
                        // console.log(decoded.authorID)
                        let {userID ,email , name } = decoded;
                        let token = jwt.sign({userID ,email , name },process.env.normalKey,{expiresIn:60*60});
                        res.send({token})
                    }
                });

            }
        }else{
            res.send({msg:"Please Login Again reft"});
        }
    } catch (error) {
        res.send({"msg":error.message})
    }
})

usersRoute.get("/userdata", async (req,res)=>{
    let data = await UserModel.find();
    res.send(data);
})

usersRoute.get("/userdata/:id", async (req,res)=>{
    let ID = req.params.id;
    let data = await UserModel.find({_id:ID});
    res.send(data);
})

module.exports = {usersRoute}