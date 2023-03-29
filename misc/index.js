const express = require("express")
//node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express()

const client_id="ecf89f42afe601c8d613"
const client_secret = "1e2bdd5424e9abb53f7422c3017c11c66718da13"

app.get("/",(req,res)=>{
    res.send("Api base endpoint")
})

app.get("/login" , (req,res)=>{
    // res.send("contiue with github button")
    res.sendFile(__dirname+ "/index.html")
})

app.get("/auth/github",async(req,res)=>{
    const {code} = req.query

    let accessToken = await fetch("https://github.com/login/oauth/access_token",{
        method : "POST",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            client_id : client_id,
            client_secret : client_secret,
            code 
        })
    })
    .then((res)=> res.json())
    //access token
    const access_token= accessToken.access_token

    const userDetails =await fetch("https://api.github.com/user",{
        method : "GET",
        headers : {
            Authorization : `Bearer ${access_token}`
        }
    })
.then((res)=> res.json())

console.log(userDetails)

    res.send("xyz")


   
})

app.listen(8000,()=>{
    console.log("8000 port is working")
})