const express = require('express')
const router = express.Router();



const {
     createRoom,
     getAllRooms
} = require('../controllers/roomController')



router.post('/', createRoom)


router.get('/', getAllRooms
)


module.exports = router;