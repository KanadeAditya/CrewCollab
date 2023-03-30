// require("dotenv").config();
// const passport = require("passport");
// const {UserModel} =require("./model/user.model.js");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { v4: uuidv4 } = require('uuid');



// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:4040/auth/google/callback"
//   },
//    async function (accessToken, refreshToken, profile, cb) {
//        let email = profile._json.email;
//        let name = profile._json.name;
//        const user = new UserModel({
//             name,
//             email,
//             password: uuidv4()
//         })
//        await user.save()
//       return cb(null, user)
//   }
// ));

// module.exports = {passport}