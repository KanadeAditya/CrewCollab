const express = require("express");
const { connection, client } = require("./db.js");
const  {usersRoute} = require("./controller/user.routes.js");
const {authenticator} = require("./middleware/authentication.js");
require("dotenv").config();
const cors = require("cors");

const app = express();
const httpServer=require('http').createServer(app);
const {Server}=require('socket.io');
const io= new Server(httpServer);

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
   // Login page will be sent from here
   res.status(200).send('Welcome to SlackBot....');
})

app.use("/users",usersRoute);
// app.use(authenticator)

httpServer.listen(process.env.port,async ()=>{
   try {
    await connection;
    console.log("Connected to MongoDB");
   } catch (error) {
    console.log({"error":error.message});
   }
   console.log(`Running at port: ${process.env.port}`);
})
