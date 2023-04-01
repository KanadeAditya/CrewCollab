const moment = require('moment');

const formatTime = () => {
    // return moment().format('hh:mm:ss')
    return new Date()
}

module.exports = { formatTime }