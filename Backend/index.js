const express = require("express");

const { connection, client } = require("./db.js");
const { usersRoute } = require("./controller/user.routes.js");
const { messegerouter } = require("./controller/message.controller.js");
const { RoomModel } = require('./model/room.model');
const { UserModel } = require('./model/user.model');
const { authenticator } = require("./middleware/authentication.js");

const { formatMsg } = require('./utils/message');

const {uniqid} =require('uniqid');
require("dotenv").config();
const cors = require("cors");

// const { passport } = require("./google-auth")


const { userJoin, getRoomUsers, getCurrentUser, userLeave,  users:onlineusers } = require("./utils/users");

//commented by tarun
// const { passport } = require("./google-auth")

const app = express();
app.use(cors());
app.use(express.json());
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const { MessageModel } = require("./model/message.model.js");
const io = new Server(http);

//////////////////////
io.on('connection', (socket) => {

   console.log('connected a new user');

   socket.on("createRoom", async ({ email, roomName, userID}) => {

      const roomID=uniqid();
      // Just for creation of the room
      const newRoom = new RoomModel({ roomName, userID, time:Date.now(), roomID });  //here roomID implemented
      await newRoom.save();

      // Just for rooms and their connected users
      
      socket.join(roomID);
      socket.emit("message", formatMsg('CrewCollab', `You created the group ${roomName}`));

      // Saving user message to DB
      const msg= new MessageModel({email, message:`You created the group ${roomName}`, roomname:roomID, userID, time:Date.now()});
      await msg.save();
   })


   socket.on("joinRoom", async ({ email,username, userID, roomID }) => {
      // Below function is just checking the onlne users
      const online_users = userJoin(socket.id, userID, room); 
      socket.emit("message", formatMsg('CrewCollab', `Welcome to Slack`));
      socket.join(roomID);


      socket.broadcast.to(roomID).emit("message", formatMsg('CrewCollab', `${username} joined`));
      
      const msg= new MessageModel({email, message:`${username} joined`, roomname:roomID, userID, time:Date.now()});

      await msg.save();

      io.to(roomID).emit("roomUsers", {
         roomID,
         users: getRoomUsers(roomID)
      });

      console.log(onlineusers);

   })

   socket.on("chatMsg", (msg, user, room) => {


      // const user = getCurrentUser(socket.id); //get the room and username directly 
      //because msg will go to spcefic rooms


      io.to(room).emit("message", formatMsg(user, msg, room));

   });

   socket.on('disconnect', () => {

      const user = userLeave(socket.id);
      let rooms = user?.room||[];
      rooms.forEach(e => {
         socket.broadcast.to(e).emit("message", formatMsg('ChatMe', `${user.username} has left the chat`));

         io.to(e).emit("roomUsers", {
            room: e,
            users: getRoomUsers(e)
         })
      });

   })
})
//////////////////////

app.get('/', (req, res) => {
   // Login page will be sent from here
   res.status(200).send('Welcome to SlackBot....');
})


app.get("/", (req, res) => {
   res.send("Home Page")
})

// Abhinav
// app.get('/auth/google',
//    passport.authenticate('google', { scope: ['profile', 'email'] }));


// app.get('/auth/google',
//    passport.authenticate('google', { scope: ['profile', 'email'] }));


// app.get('/auth/google/callback',
//    passport.authenticate('google', { failureRedirect: '/login', session: false }),
//    function (req, res) {
//       console.log(req.user);
//       // Successful authentication, redirect home.
//       res.redirect('/');
//    });





// app.get('/auth/google/callback',
//    passport.authenticate('google', { failureRedirect: '/login', session: false }),
//    function (req, res) {
//       console.log(req.user);
//       // Successful authentication, redirect home.
//       res.redirect('/');
//    }); 


usersRoute.get("/chat",(req,res)=>{
   res.sendFile("Frontend\chat.html")
})

app.use("/users", usersRoute);
app.use("/message",messegerouter);


http.listen(process.env.port, async () => {
   try {
      await connection;
      console.log("Connected to MongoDB");
   } catch (error) {
      console.log({ "error": error.message });
   }
   console.log(`Running at port: ${process.env.port}`);
})
