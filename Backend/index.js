const express = require("express");

const { connection} = require("./db.js");
const { usersRoute } = require("./controller/user.routes.js");
const { messegerouter } = require("./controller/message.controller.js");
const { RoomModel } = require('./model/room.model');
const { getUser } = require('./utils/getUser.js');
const { formatTime } = require('./utils/formatTime.js');

const uniqid = require('uniqid');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.crypterKey);

require("dotenv").config();
const cors = require("cors");

// const { passport } = require("./google-auth")

const { userJoin, getRoomUsers, userLeave, users: onlineusers } = require("./utils/users");

const app = express();
app.use(cors());
app.use(express.json());
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const { MessageModel } = require("./model/message.model.js");
const io = new Server(http);

io.on('connection', (socket) => {

   console.log('connected a new user');

   socket.on("createRoom", async ({ token, roomName }) => {
      let user = getUser(token);
      console.log(user);
      const roomID = uniqid();
      const online_users = userJoin(socket.id, token, roomID);

      // Just for creation of the room
      const newRoom = new RoomModel({ room: roomName, userID: user.userID, time: formatTime(), roomID });  //here roomID implemented
      await newRoom.save();

      // Just for rooms and their connected users
      socket.join(roomID);
      socket.emit('room_li_create', roomName, roomID);
      socket.emit('message', { username: 'CrewCollab', text: `You created the group ${roomName} ${roomID}`, roomID, time: formatTime() });

      // Saving user message to DB
      const msg = new MessageModel({ email: user.email, message: `You created the group ${roomName}`, userID: user.userID, roomname: roomName, roomID, time: formatTime() });
      await msg.save();
   })

   socket.on("joinRoom", async ({ token, roomID }) => {
      let user = getUser(token);
      let data = await RoomModel.findOne({ roomID });
      let roomName = data.room;
      console.log(roomName);

      // Below function is just checking the onlne users
      const online_users = userJoin(socket.id, user.userID, roomID);
      socket.emit('room_li_create', roomName, roomID);
      socket.emit("message", { username: 'CrewCollab', text: `Welcome to CrewCollab`, roomID, time: formatTime() });
      socket.join(roomID);

      socket.broadcast.to(roomID).emit("message", { username: 'CrewCollab', text: `${user.name} joined`, roomID, time: formatTime() })
      const msg = new MessageModel({ email: user.email, message: `${user.name} joined`, userID: user.userID, roomname: roomName, roomID, time: formatTime() });
      await msg.save();

      io.to(roomID).emit("roomUsers", {
         roomID,
         users: getRoomUsers(roomID)
      });

   })

   socket.on("onlineUsers", async ({ token, roomID }) => {

      socket.join(roomID);

      io.to(roomID).emit("roomUsers", {
         roomID,
         users: getRoomUsers(roomID)
      });

      console.log(onlineusers);

   })

   socket.on("chatMsg", async (msg, token, roomID) => {
      let user = getUser(token);
      let data = await RoomModel.findOne({ roomID });
      let roomName = data.room;

      const encryptedMsg = cryptr.encrypt(msg);
      const decryptedMsg = cryptr.decrypt(encryptedMsg);

      socket.to(roomID).emit('message', decryptedMsg);
      const newMsg = new MessageModel({ email: user.email, message: encryptedMsg, userID: user.userID, roomname:roomName, roomID, time: Date.now() });
      await newMsg.save();

      io.to(roomID).emit("message", { username: user.name, text: decryptedMsg, roomID, time: formatTime() });
   });

   socket.on('disconnect', (roomID) => {

      const user = userLeave(socket.id);
      let rooms = user?.roomID || [];
      rooms.forEach(e => {
         socket.broadcast.to(e).emit("message", { username: 'CrewCollab', text: `${user.username} has left the chat`, roomID: e, time: formatTime() })
         io.to(e).emit("roomUsers", {
            roomID: e,
            users: getRoomUsers(e)
         })
      });
   })
})

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


usersRoute.get("/chat", (req, res) => {
   res.sendFile("Frontend\chat.html")
})

app.use("/users", usersRoute);
app.use("/message", messegerouter);


http.listen(process.env.port, async () => {
   try {
      await connection;
      console.log("Connected to MongoDB");
   } catch (error) {
      console.log({ "error": error.message });
   }
   console.log(`Running at port: ${process.env.port}`);
})
