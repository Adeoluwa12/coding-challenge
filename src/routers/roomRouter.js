const express = require('express')
const router = express.Router();



const {
     createRoom,
     getAllRooms,
     getTwoUserConversations,
     getOneUSerConversation
} = require('../controllers/roomController')


const {
     verifyToken,
     verifyTokenAndAuthorization,
     verifyTokenAndAdmin,

} = require('../middleware/jwt_helper')

const {
     authenticateUser,
     authorizePermissions,
} = require('../middleware/authentication')



router.post('/', verifyToken, createRoom)


router.get('/', verifyToken, getAllRooms
)

router.get('/find/', verifyToken, getOneUSerConversation);
router.post('/find/user', verifyToken, getTwoUserConversations);


module.exports = router;