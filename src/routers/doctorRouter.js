const express = require('express');
const router = express.Router();




const {
     getOneDoctor,
     getAllDoctors,
     updateImage 
} = require('../controllers/doctorController');


/**
 * "@openapi":
 * 'api/v1/doctors':
 * get:
 * tages:
 *  - Doctors
 * dec: Response if the app is up and running
 * responses:
 * 200:
 * dec: APP is up and running
 */
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