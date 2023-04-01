// const user = {
//     name: 'user',
//     rooms: [roomid, roomid2],
//     msg: {
//         room_id: [{}, {}],
//         room_id2: [{}, {}],
//         room_id: [{}, {}],
//     }
// }


const token = localStorage.getItem("token");
const refreshtoken = localStorage.getItem("refreshtoken");
console.log(token, '\n', refreshtoken);

// { write a function to fetch all room data, with their ids & name and call createRoom(roomName, roomID)  } 

const socket = io("http://localhost:4040/", { transports: ["websocket"] });

let username = localStorage.getItem("user") || 'Aman';
console.log(username);

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

let sendbtn = document.getElementById('send-msg');
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

        socket.emit("fetchmessages", {token, roomID: data }); // join room

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


let msgul = document.querySelector(".messages");

socket.on("message", (message) => {

    // outputMessage(message);
    console.log(message);
    // Append message on container
    // let msgli = document.createElement('li')
    // msgli.innerHTML = `<div> message1</div>`;
    // msgul.append(msgli);

})

socket.on("roomUsers", ({ roomID, users }) => {

    // roomName.innerText= room;
    console.log({ roomID, users });

    // outputRoomUsers(users) for online users

})