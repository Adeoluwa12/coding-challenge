const express = require('express')
const router = express.Router();



const {
     create,
     login
} = require('../controllers/doctorAuth');




router
     .route('/signup')
     .post(create)

router.post('/login', login);





module.exports = router