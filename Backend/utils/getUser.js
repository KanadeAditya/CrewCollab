const jwt=require('jsonwebtoken');
require("dotenv").config();

async function getUser(token){
    jwt.verify(token,process.env.normalKey,(err,decoded)=>{
        if(decoded){
            return decoded;
        }
        else{
            return false;
        }
    })
}

module.exports={getUser}

