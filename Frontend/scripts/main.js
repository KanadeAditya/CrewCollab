const userName= document.getElementById('user-name');
const roomId= document.getElementById('room-id');
const Room= document.getElementById('room');

const message= document.getElementById('msg');
const send= document.getElementById('send')

 
const socket = io('ws://localhost:4040/',{transports:["websocket"]});

socket.emit("joinRoom",{username,room});

