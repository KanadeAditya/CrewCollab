const moment=require('moment');

const formatMsg=(username,text)=>{
    return {
        username,
        text,
        time:moment().format('hh:mm:ss') 
    }
}

module.exports={formatMsg}