const express = require('express');
const router = express.Router();




const {
     getOneDoctor,
     getAllDoctors,
     updateImage 
} = require('../controllers/doctorController');



router
.route('/')
.get(getAllDoctors)


router
.route('/:id')
.get(getOneDoctor)


router
.route("/:id/image")
.put(updateImage);



module.exports = router;