const jwt = require('jsonwebtoken');
require("dotenv").config();

function getUser(token) {
    let user;
    console.log(token);
    jwt.verify(token, process.env.normalKey, (err, decoded) => {
        if (decoded) {
            user = decoded;
        }
        else {
            user= {
                userID: '1234'
            };
        }
        // console.log(decoded)
    })
    
    return user;
}
module.exports = { getUser }