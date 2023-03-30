const mongoose = require("mongoose");

const roomschema = new mongoose.Schema({
    room:{type:String,required:true},
    userID:{type:String,required:true},
    time:{type:Date, required : true},
    roomID :{type:String,required:true}
})

const RoomModel = mongoose.model("room",roomschema);

module.exports = {RoomModel};