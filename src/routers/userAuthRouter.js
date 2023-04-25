const express = require('express')
const router = express.Router();



const {
     create,
     logout,
     login
} = require('../controllers/userAuth');

const {
     verifyToken,
     verifyTokenAndAuthorization,
     verifyTokenAndAdmin,

} = require('../middleware/jwt_helper')


router
.route('/signup')
.post(create)

router.post('/login', login);
router.get('/logout', verifyToken,logout);




module.exports = router