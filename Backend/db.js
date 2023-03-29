const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.mongoURL);

// Redis configuration
const redis=require('redis');
const client=redis.createClient({url: process.env.redisURL});
client.on('error', err => console.log('Redis Client Error', err));



module.exports = {connection,client}