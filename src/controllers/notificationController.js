const Pusher = require("pusher");

const pusher = new Pusher({
     appId: process.env.PUSHER_APPID,
     key: process.env.PUSHER_KEY,
     secret: process.env.PUSHER_SECRET,
     cluster: process.env.PUSHER_CLUSTER,
     useTLS: true
});




module.exports = pusher;