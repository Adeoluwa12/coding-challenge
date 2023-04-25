const express = require('express')
const router = express.Router();



const {
     createRoom,
     getAllRooms,
     getTwoUserConversations,
     getOneUSerConversation
} = require('../controllers/roomController')



router.post('/', createRoom)


router.get('/', getAllRooms
)

router.get('/find/', getOneUSerConversation);
router.post('/find/user', getTwoUserConversations);


module.exports = router;