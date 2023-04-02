const express = require("express");
const mongoose = require("mongoose");
const usersRoute = express.Router();
const { UserModel } = require("../model/user.model.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

//////////REDIS//////////////////

const redis = require("redis");
const client = redis.createClient({ url: process.env.redisURL });
client.on("error", (err) => console.log("Redis Client Error", err));

(async function connecting() {
  await client.connect();
})();

/////////////////////////////////

const jwt = require("jsonwebtoken");
const { authenticator } = require("../middleware/authentication.js");

usersRoute.get("/", (req, res) => {
  res.send("working");
});

usersRoute.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.send({ msg: "Provide all the details" });
  }
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        res.send({ msg: err });
      } else {
        let ifexist = await UserModel.find({ email: email });
        if (ifexist.length) {
          res.send({
            msg: "Account already Registered with this email Please login",
            emailexists: true,
          });
        } else {
          const newuser = new UserModel({ name, email, password: hash });
          await newuser.save();

          res.send({ msg: "User Registered",newuser });
        }
      }
    });
  } catch (error) {
    res.send({ msg: error.message });
  }
});

usersRoute.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length !== 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          res.send({ msg: err });
        } else {
          if (result) {
            let token = jwt.sign(
              { userID: user[0]._id, email, name: user[0].name },
              process.env.normalKey,
              { expiresIn: 60 * 60 }
            );
            let refreshtoken = jwt.sign(
              { userID: user[0]._id, email, name: user[0].name },
              process.env.refreshkey,
              { expiresIn: 60 * 60 * 60 }
            );
            res.send({ msg: "user logged in", token, refreshtoken });
          } else {
            res.send({ msg: "Wrong password" });
          }
        }
      });
    } else {
      res.send({ msg: "wrong email" });
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
});

usersRoute.get("/logout", async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[0];
    let refreshtoken = req.headers.authorization.split(" ")[1];
    if (token && refreshtoken) {
      await client.SADD("blackTokens", token);
      await client.SADD("blackTokens", refreshtoken);
      res.send({ msg: "Log out successfull" });
    } else {
      res.status(401).send("Unauthorised..!!!");
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
});

usersRoute.get("/refreshtoken", authenticator, async (req, res) => {
  try {
    let refreshtoken = req.headers.authorization;

    if (refreshtoken) {
      let exist = await client.SISMEMBER("blackTokens", refreshtoken);
      if (exist) {
        res.send({ msg: "Please Login Again " });
      } else {
        jwt.verify(refreshtoken, process.env.refreshkey, (err, decoded) => {
          if (err) {
            res.send({ msg: err });
          } else {
            let { userID, email, name } = decoded;
            let token = jwt.sign(
              { userID, email, name },
              process.env.normalKey,
              { expiresIn: 60 * 60 }
            );
            res.send({ token });
          }
        });
      }
    } else {
      res.send({ msg: "Please Login Again reft" });
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
});

usersRoute.get("/userdata", async (req, res) => {
  let data = await UserModel.find();
  res.send(data);
});

usersRoute.get("/userdata/:id", async (req, res) => {
  let ID = req.params.id;
  let data = await UserModel.find({ _id: ID });
  res.send(data);
});

//Github Oauth code

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client_id = "ecf89f42afe601c8d613";
const client_secret = "1e2bdd5424e9abb53f7422c3017c11c66718da13";

usersRoute.get("/auth/github", async (req, res) => {
  const { code } = req.query;
//   res.send(code)

  let accessToken = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      code,
    }),
  }).then((res) => res.json());
  //access token
  const access_token = accessToken.access_token;

  const userDetails = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());

  console.log(userDetails);
//   console.log(accessToken);
  // let userData = accessToken

  let obj = {
      "name" : userDetails.name,
      "email" : userDetails.login,
      "password" :  `${userDetails.id}`
  }

  // console.log(obj)
  res.send(obj);

});

module.exports = { usersRoute };
