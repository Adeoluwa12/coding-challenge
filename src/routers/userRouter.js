const express = require('express');
const router = express.Router();



const {
     getOneUser,
     getAllUsers ,
     updateImage 
} = require('../controllers/userController')



router
.route('/')
.get(getAllUsers)


router
.route('/:id')
.get(getOneUser)


router
.route("/:id/image")
.put(updateImage);




module.exports = router;