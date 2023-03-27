const mongoose = require("mongoose");

const blacklistschema = mongoose.Schema({
    token:{type:String,required:true},
    refreshtoken : {type:String,required:true}
},{ versionKey: false })

const blacklist = mongoose.model("blacklist",blacklistschema);

module.exports = {blacklist};