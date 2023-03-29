const express = require("express");
const { connection } = require("./db.js");
const  {usersRoute} = require("./controller/user.routes.js");
const {authenticator} = require("./middleware/authentication.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
app = express();
const {passport} = require("./google-auth")

app.use(cors());
app.use(express.json());
app.use(cookieParser());

require("dotenv").config();

app.get("/", (req, res) => {
   res.send("Home Page")
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',session:false }),
   function (req, res) {
     console.log(req.user);
    // Successful authentication, redirect home.
    res.redirect('/');
  });





app.use("/users",usersRoute);
// app.use(authenticator)

app.listen(process.env.port,async ()=>{
   try {
    await connection;
    console.log("Mongo DB connected Server running")
   } catch (error) {
    console.log({"error":error.message})
   }
})
