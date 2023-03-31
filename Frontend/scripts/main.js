// const user = {
//     name: 'user',
//     rooms: [roomid, roomid2],
//     msg: {
//         room_id: [{}, {}],
//         room_id2: [{}, {}],
//         room_id: [{}, {}],
//     }
// }

let username = 'Aman';
function getusername() {
    let data = prompt("Enter username",);
    if (data != null) {
        username = data;
        console.log('user is-->', username);
    }
}

const socket = io("http://localhost:8080/", { transports: ["websocket"] });


function roomCreate() {
    let roomID = prompt("Enter your room",);
    if (roomID != null) {
        console.log(roomID);
        console.log('room created', username, roomID);
        createRoom(roomID);
    }

}

let sendbtn = document.getElementById('send-msg');
// room creation
function createRoom(roomID) {
    let roomList = document.getElementById('rm-list');
    let newRoom = document.createElement('li')
    newRoom.innerText = `Room ${roomID}`
    newRoom.setAttribute('class', 'room');
    newRoom.dataset.id = roomID;
    roomList.append(newRoom)

    newRoom.addEventListener('click', (e) => {
        // console.log(e.target.dataset.id);

        // fetch room messages here and call append function to show message on container

        socket.emit("joinRoom", { username, roomID }); // join room

        sendbtn.dataset.room = roomID;
    })
}
sendbtn.addEventListener('click', (e) => {
    e.preventDefault();
    let newMsg = document.getElementById('new-msg').value;
    // console.log(newMsg, 'room:', e.target.dataset.room);
    socket.emit('chatMsg', newMsg, username, e.target.dataset.room);
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