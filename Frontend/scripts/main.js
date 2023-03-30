const userName = document.getElementById('user-name');
const roomId = document.getElementById('room-id');
const room_Id = document.getElementById('room_id');
const Room = document.getElementById('room');

const message = document.getElementById('msg');
const send = document.getElementById('send')




const socket = io("http://localhost:8080/", { transports: ["websocket"] });

Room.addEventListener('click', () => {
    const username = userName.value;
    let room = roomId.value; 
    room = room.trim().split(' ');

    room.forEach(e => {
        socket.emit("joinRoom", { username, room: e });

    });


    console.log('room created', userName.value, room);
})

socket.on("message", (message) => {

    // outputMessage(message);
    console.log(message);

})

send.addEventListener('click', () => {
    const msg = message.value;
    const Room_Id = room_Id.value;
    console.log('msg send', msg, userName.value, Room_Id);
    socket.emit('chatMsg', msg, userName.value, Room_Id);
    message.value = '';

})

socket.on("roomUsers", ({ room, users }) => {

    // roomName.innerText= room;
    console.log({ room, users });

    // outputRoomUsers(users)

})