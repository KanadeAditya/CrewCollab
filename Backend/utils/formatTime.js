const moment = require('moment');

const formatTime = () => {
    return moment().format('hh:mm:ss')
}

module.exports = { formatTime }