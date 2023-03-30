const express = require("express");
const { connection, client } = require("./db.js");
const { usersRoute } = require("./controller/user.routes.js");
const { RoomModel } = require('./model/room.model');
const { UserModel } = require('./model/user.model');
const { RoomUserModel } = require('./model/room.users.model');
const { authenticator } = require("./middleware/authentication.js");
const { formatMsg } = require('./utils/message');

const {uniqid} =require('uniqid');
require("dotenv").config();
const cors = require("cors");

const { passport } = require("./google-auth")

const { userJoin, getRoomUsers, getCurrentUser, userLeave,  users:onlineusers } = require("./utils/users");
 


const { passport } = require("./google-auth")



const app = express();
app.use(cors());
app.use(express.json());
const http = require('http').createServer(app);



const { Server } = require('socket.io');
const io = new Server(http);

//////////////////////
io.on('connection', (socket) => {

   console.log('connected a new user');




   socket.on("createRoom", async ({ roomName, userID}) => {

      const roomID=uniqid();
      // Just for creation of the room
      const newRoom = new RoomModel({ roomName, userID, time:Date.now(), roomID });  //here roomID implemented
      await newRoom.save();

      // Just for rooms and their connected users
      // const userRoom = new RoomUserModel({room: roomID, admin:userID, users:[userID] });
      // await userRoom.save();

      // await UserModel.findByIdAndUpdate({_id:userID},{
      //    rooms: [{type:string, default:null}]
      // })

      
      socket.join(roomID);
      socket.emit("message", formatMsg('CrewCollab', `You created the group ${roomName}`));

      io.to(roomID).emit("roomUsers", {
         roomID,
         users: getRoomUsers(room)
      });

   })

   socket.on("joinRoom", async ({ username, roomID }) => {
      const user = userJoin(socket.id, username, room); 
      socket.join(roomID);
      socket.emit("message", formatMsg('CrewCollab', `${username} joined`));

      socket.broadcast.to(roomID).emit("message", formatMsg('CrewCollab', `${username} joined`));

      io.to(roomID).emit("roomUsers", {
         roomID,
         users: getRoomUsers(room)

   


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


app.get('/auth/google',
   passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
   passport.authenticate('google', { failureRedirect: '/login', session: false }),
   function (req, res) {
      console.log(req.user);
      // Successful authentication, redirect home.
      res.redirect('/');
   });





// app.get('/auth/google/callback',
//    passport.authenticate('google', { failureRedirect: '/login', session: false }),
//    function (req, res) {
//       console.log(req.user);
//       // Successful authentication, redirect home.
//       res.redirect('/');
//    }); 



app.use("/users", usersRoute);
app.use(authenticator)


http.listen(process.env.port, async () => {
   try {
      await connection;
      console.log("Connected to MongoDB");
   } catch (error) {
      console.log({ "error": error.message });
   }
   console.log(`Running at port: ${process.env.port}`);
})
