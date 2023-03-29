const express = require("express");
const { connection, client } = require("./db.js");
const  {usersRoute} = require("./controller/user.routes.js");
const {authenticator} = require("./middleware/authentication.js");
const {formatMsg}=require('./utils/message');
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const http=require('http').createServer(app);
const {Server}=require('socket.io');
const io= new Server(http);

//////////////////////
io.on('connection',(socket)=>{
   console.log('connected a new user');

   socket.on("joinRoom",({username,room})=>{

    //    const user=userJoin({id:socket.id,username,room});
       socket.join(user.room);

       socket.emit("message",formatMsg('ChatMe',"Welcome to ChatMe server."));

       socket.broadcast.to(user.room).emit("message",formatMsg('ChatMe',`${username} has joined the chat`));

       io.to(user.room).emit("roomUsers",{
           room:user.room,
           users:getRoomUsers(user.room) 
       }) ;

   })

   socket.on("chatMsg",(msg)=>{
      
    //    const user = getCurrentUser(socket.id);

       io.to(user.room).emit("message",formatMsg(user.username,msg));

    });  

   socket.on('disconnect',()=>{ 

    //    const user=userLeave(socket.id);

       socket.broadcast.to(user.room).emit("message",formatMsg('ChatMe',`${user.username} has left the chat`));

       io.to(user.room).emit("roomUsers",{
           room:user.room,
        //    users:getRoomUsers(user.room)
       }) 
   })
})
//////////////////////

app.get('/',(req,res)=>{
   // Login page will be sent from here
   res.status(200).send('Welcome to SlackBot....');
})

app.use("/users",usersRoute);
// app.use(authenticator)

http.listen(process.env.port,async ()=>{
   try {
    await connection;
    console.log("Connected to MongoDB");
   } catch (error) {
    console.log({"error":error.message});
   }
   console.log(`Running at port: ${process.env.port}`);
})
