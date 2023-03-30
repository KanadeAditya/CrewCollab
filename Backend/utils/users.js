
const users = [];

const userJoin = (id, username, roomName) => {
    let user = users.find(user => user.id == id);
    if (user) {
        user.room.push(roomName);
    }
    else {
        user = { username, id, room: [roomName] };
        users.push(user);
    }
    return user;
}

const getRoomUsers = (room) => {
    return users.filter(user => (user.room).includes(room));
}

const getCurrentUser = (id) => {
    return users.find(user => user.id == id);
}

const userLeave = (id) => {
    const index = users.findIndex(user => user.id == id);

    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = { userJoin, getRoomUsers, getCurrentUser, userLeave, users }