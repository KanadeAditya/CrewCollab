const express = require("express");
const mongoose = require("mongoose")
const usersRoute = express.Router();
const {UserModel} =require("../model/user.model.js");
const {MessageModel} =require("../model/message.model.js");
const {RoomModel} =require("../model/room.model.js");
require("dotenv").config();
const jwt = require("jsonwebtoken")
const {authenticator} = require("../middleware/authentication.js");

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.encryptionkey);



const messegerouter = express.Router();

messegerouter.use(authenticator);

messegerouter.get("/",(req,res)=>{
    res.send("THESE ARE MESSAGES")
})


module.exports = {messegerouter};