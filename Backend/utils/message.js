const moment = require('moment');

const formatMsg = (username, text, room) => {
    return {
        username,
        text,
        time: moment().format('hh:mm:ss'),
        room
    }
}

module.exports = { formatMsg }