const express = require('express');
const router = express.Router();




const {
     getOneDoctor,
     getAllDoctors,
     updateDoctor,
     deleteDoctor
} = require('../controllers/doctorController');



router
.route('/')
.get(getAllDoctors)


router
.route('/:id')
.get(getOneDoctor)
.patch(updateDoctor)
.delete(deleteDoctor)






module.exports = router;