const express = require('express')
const router = express.Router()



const {
     resetPassword,
     forgetPassword
} = require('../controllers/password')




router
     .route('/forget')
     .post(forgetPassword)



router
     .route('/reset')
     .post(resetPassword)


module.exports = router;