const socket = io('ws://localhost:4040/',{transports:["websocket"]});

socket.emit("joinRoom",{username,room});