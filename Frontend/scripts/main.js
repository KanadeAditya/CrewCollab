const userName= document.getElementById('user-name');
const roomId= document.getElementById('room-id');
const Room= document.getElementById('room');

const message= document.getElementById('msg');
const send= document.getElementById('send')

 
// const socket = io('ws://localhost:8080/',{transports:["websocket"]});

// socket.emit("joinRoom",{username,room});


Room.addEventListener('click',()=>{

    console.log('room created',userName.value,roomId.value);
})

send.addEventListener('click',()=>{
    console.log('msg send',message.value);
    
})
