const mongoose = require("mongoose");

const messageschema = mongoose.Schema({
    email:{type:String,required:true},
    message:{type:String,required:true},
    userID:{type:String,required:true},
    roomname:{type:String,required:true},
    roomID:{type:String,required:true},
    time: {type:Date , required : true}
})

const MessageModel = mongoose.model("message",messageschema);

module.exports = {MessageModel};