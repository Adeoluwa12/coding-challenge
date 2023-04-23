const express = require('express')
const router = express.Router();



const {
     create,
     logout,
     login
} = require('../controllers/doctorAuth');




router
.route('/signup')
.post(create)

router.post('/login', login);
router.get('/logout', logout);




module.exports = router