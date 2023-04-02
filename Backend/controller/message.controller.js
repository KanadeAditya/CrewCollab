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
const cryptr = new Cryptr(process.env.crypterKey);



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
          'from': 'messages', 
          'localField': 'email', 
          'foreignField': 'email', 
          'as': 'result'
        }
      }, {
        '$unwind': {
          'path': '$result'
        }
      }, {
        '$group': {
          '_id': '$email', 
          'rooms': {
            '$push': {
              'roomname': '$result.roomname', 
              'roomID': '$result.roomID'
            }
          }
        }
      }, {
        '$match': {
          '_id': `${email}`
        }
      }, {
        '$unwind': {
          'path': '$rooms'
        }
      }, {
        '$group': {
          '_id': {
            'roomid': '$rooms.roomID', 
            'roomname': '$rooms.roomname'
          }
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
            'from': 'messages', 
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
        'from': 'messages', 
        'localField': 'roomID', 
        'foreignField': 'roomID', 
        'as': 'result'
      }
    }, {
      '$match': {
        'roomID': `${roomID}`
      }
    },{
      '$project': {
        'result': 1
      }
    }
  ])
  console.log(users);
    users[0].result.forEach((item)=>{
      let decrptedMsg=cryptr.decrypt(item.message);
      item.message=decrptedMsg;
      console.log(item.message)
    })
    console.log(users);
    res.send(users)
})

messegerouter.get('/getUsername',(req,res)=>{
  let {name}=req.body;
  res.send({name});
})

module.exports = {messegerouter};