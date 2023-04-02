let msgul = document.querySelector(".messages");
let onlineul = document.querySelector("#online_ul");
let sendbtn = document.getElementById('send-msg');
let userElem=document.getElementById("uname");
let currRoom=document.getElementById("current-room-name");
let logoutBtn=document.getElementById("logoutBtn");

const token = localStorage.getItem("token");
const refreshtoken = localStorage.getItem("refreshtoken");
console.log(token, '\n', refreshtoken);

let username = localStorage.getItem("user") || 'usernotfound';
console.log(username);

(async function getUsername(){
    try {
        let req = await fetch(`http://localhost:4040/message/getUsername`, {
            method: 'GET',
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        })
        let user = await req.json();
        console.log(user);
        userElem.innerText=user.name;
    } catch (error) {
        console.log({ error });
    }
})()

const socket = io("http://localhost:4040/", { transports: ["websocket"] });
// { write a function to fetch all rooms, with their ids & name and call createRoom(roomName, roomID)  } 
(async function getRooms() {
    try {
        let req = await fetch(`http://localhost:4040/message/roomsConnected`, {
            method: 'GET',
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        })
        let response = await req.json();
        // let rooms = response[0].rooms;
        console.log(response);
        response.forEach(e => {
            let rn = e._id.roomname;
            let ri = e._id.roomid;
            createRoom(rn, ri);
        });
    } catch (error) {
        console.log({ error });
    }
})()

// room creation
function roomCreate() {
    let roomName = prompt("Enter your room",);
    if (roomName != null) {
        console.log(roomName);
        console.log('room created', username, roomName);
    }
    socket.emit("createRoom", { token, roomName }); // room creation
}

function roomJoin() {
    let data = prompt("Enter roomId",);
    if (data != null) {
        socket.emit("joinRoom", { token, roomID: data });
    }
}

socket.on('room_li_create', (roomName, roomID) => {
    createRoom(roomName, roomID);
})


let prev=[];
function createRoom(roomName, roomID) {
    let roomList = document.getElementById('rm-list');
    let newRoom = document.createElement('li');
    newRoom.innerText = `${roomName}`;
    newRoom.setAttribute('class', 'room');
    newRoom.dataset.id = roomID;
    roomList.append(newRoom);

    newRoom.addEventListener('click', async(e) => {
        document.querySelectorAll('.room').forEach((tag)=>{
            tag.style.backgroundColor= '#2b2d42';
        })
        newRoom.style.backgroundColor='#3f0e40';

        msgul.innerHTML='';
        // fetch room messages here and call append function to show message on container
        let req = await fetch(`http://localhost:4040/message/roomsMessageID/${roomID}`, {
            method: 'GET',
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        })
        let response = await req.json();
        // console.log(response);
        let msgs = response[0].result;
        msgs.forEach((doc)=>{
            appendMsg(doc);
        })
        socket.emit("onlineUsers", { token, roomID }); // joining room and also getting online users
        currRoom.innerText=roomName;
        msgul.dataset.id = roomID;
        sendbtn.dataset.room = roomName;
        sendbtn.dataset.id = roomID;
        msgul.scrollTo({top:350000, behavior:"smooth"});
    })
    
}
sendbtn.addEventListener('click', (e) => {
    e.preventDefault();
    let newMsg = document.getElementById('new-msg');
    socket.emit('chatMsg', newMsg.value, token, e.target.dataset.id);
    newMsg.value='';
})

let count = 0;
socket.on("message", (message) => {
    // Append message on container of correct room id.
    appendMsg(message);
})

socket.on("roomUsers", ({ roomID, users }) => {
    onlineul.innerHTML='';
    users.forEach((user)=>{
        let onlineli=document.createElement('li');
        onlineli.setAttribute('class','online');
        onlineli.innerText=user.username;
        onlineul.append(onlineli);
    })
})

function appendMsg(message){

let msgli = document.createElement('li')
msgli.setAttribute('class', "message");
    // if (message.roomID == msgul.dataset.id) {
        msgli.innerHTML = `
        <div class="message-content">
            <span class="username">${message.email}</span>
            <p>${message.message}</p>
            <span class="time">${message.time}</span> 
        </div>`;
    // }
    // else {
    //     count++
    //     console.log(`${count}new messages`, message);
    // }
    msgul.append(msgli);
    msgul.scrollTo({top:350000, behavior:"smooth"});
}

// Logging out by clicking the logout button
logoutBtn.addEventListener("click",async()=>{
    try {
        let req = await fetch(`http://localhost:4040/users/logout`, {
            method: 'GET',
            headers: {
                "authorization": `${token} ${refreshtoken}`,
                "Content-Type": "application/json"
            }
        })
        let response = await req.json();
        if(response.msg==='Log out successfull'){
            alert(response.msg);
            window.location.href= './login.html';
        }
        else{
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
})