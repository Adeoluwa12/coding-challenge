const express = require('express')
const router = express.Router();



const {
     createRoom,
     getAllRooms
} = require('../controllers/roomController')



router.post('/', createRoom)


router.post('/', getAllRooms
)


module.exports = router;