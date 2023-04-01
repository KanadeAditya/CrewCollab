// const user = {
//     name: 'user',
//     rooms: [roomid, roomid2],
//     msg: {
//         room_id: [{}, {}],
//         room_id2: [{}, {}],
//         room_id: [{}, {}],
//     }
// }
let msgul = document.querySelector(".messages");
let sendbtn = document.getElementById('send-msg');

const token = localStorage.getItem("token");
const refreshtoken = localStorage.getItem("refreshtoken");
console.log(token, '\n', refreshtoken);

let username = localStorage.getItem("user") || 'usernotfound';
console.log(username);

// { write a function to fetch all rooms, with their ids & name and call createRoom(roomName, roomID)  } 
(async function getRooms(){
    try {
        let req=await fetch(`http://localhost:4040/message/roomsConnected`,{
            method:'GET',
            headers:{
                "authorization": token,
                "Content-Type":"application/json"
            }            
        })
        let response=await req.json();
        let rooms=response[0].rooms;
        console.log(rooms);
    } catch (error) {
        console.log({error});
    }
})()

const socket = io("http://localhost:4040/", { transports: ["websocket"] });



function roomCreate() {
    let roomName = prompt("Enter your room",);
    if (roomName != null) {
        console.log(roomName);
        console.log('room created', username, roomName);
    }
    socket.emit("createRoom", { roomName, token }); // room creation
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


// room creation
function createRoom(roomName, roomID) {
    let roomList = document.getElementById('rm-list');
    let newRoom = document.createElement('li')
    newRoom.innerText = `Room ${roomName}`
    newRoom.setAttribute('class', 'room');
    newRoom.dataset.id = roomID;
    roomList.append(newRoom)

    newRoom.addEventListener('click', (e) => {
        // console.log(e.target.dataset.id);

        // fetch room messages here and call append function to show message on container

        socket.emit("onlineUsers", { token, roomID }); // joining room and also getting online users

        msgul.dataset.id = roomID;
        sendbtn.dataset.room = roomName;
        sendbtn.dataset.id = roomID;
    })
}
sendbtn.addEventListener('click', (e) => {
    e.preventDefault();
    let newMsg = document.getElementById('new-msg').value;
    // console.log(newMsg, 'room:', e.target.dataset.room);
    socket.emit('chatMsg', newMsg, username, e.target.dataset.id);
})




let count = 0;
socket.on("message", (message) => {
    // outputMessage(message);
    console.log(message);
    // Append message on container of correct room id.
    let msgli = document.createElement('li')
    if (message.room == msgul.dataset.id) {
        msgli.innerHTML = `
        <div class="message-content">
            <span class="username">${message.username}</span>
            <p>${message.text}</p>
            <span class="time">${message.time}</span> 
        </div>`;
    }
    else {
        count++
        console.log(`${count}new messages`, message);
    }

    msgul.append(msgli);

})

socket.on("roomUsers", ({ roomID, users }) => {

    // roomName.innerText= room;
    console.log({ roomID, users });

    // outputRoomUsers(users) for online users

})