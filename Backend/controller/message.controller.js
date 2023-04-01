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

messegerouter.use(authenticator)

messegerouter.get("/",(req,res)=>{
    res.send("THESE ARE MESSAGES")
})

messegerouter.get("/roomsConnected",async(req,res)=>{
    let email = req.body.email;
    let rooms = await UserModel.aggregate([
      {
        '$lookup': {
          'from': 'message', 
          'localField': 'email', 
          'foreignField': 'email', 
          'as': 'message'
        }
      }, {
        '$unwind': {
          'path': '$message'
        }
      }, {
        '$group': {
          '_id': '$email', 
          'rooms': {
            '$push': '$message.roomname'
          }
        }
      }, {
        '$unwind': {
          'path': '$rooms'
        }
      }, {
        '$lookup': {
          'from': 'room', 
          'localField': 'rooms', 
          'foreignField': 'roomname', 
          'as': 'result'
        }
      }, {
        '$project': {
          'rooms': 1, 
          'roomid': '$result.roomID'
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'rooms': {
            '$push': {
              'roomname': '$rooms', 
              'roomID': '$roomid'
            }
          }
        }
      }, {
        '$match': {
          '_id': `${email}`
        }
      }
    ]);
    //   console.log(email)

      res.send(rooms);
})

messegerouter.get("/roomsMessage/:roomname",async (req,res)=>{
    let {roomname} = req.params;
    let users = await RoomModel.aggregate([
        {
          '$lookup': {
            'from': 'message', 
            'localField': 'roomname', 
            'foreignField': 'roomname', 
            'as': 'message'
          }
        }, {
          '$match': {
            'roomname': `${roomname}`
          }
        }
      ])

      res.send(users)
})

messegerouter.get("/roomsMessageID/:roomID",async (req,res)=>{
  let {roomID} = req.params;
  let users = await RoomModel.aggregate([
      {
        '$lookup': {
          'from': 'message', 
          'localField': 'roomID', 
          'foreignField': 'roomID', 
          'as': 'message'
        }
      }, {
        '$match': {
          'roomID': `${roomID}`
        }
      }
    ])

    res.send(users)
})


module.exports = {messegerouter};