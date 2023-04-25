const express = require('express');
const router = express.Router();




const {
     getOneDoctor,
     getAllDoctors,
     updateDoctor,
     deleteDoctor
} = require('../controllers/doctorController');


const {
     verifyToken,
     verifyTokenAndAuthorization,
     verifyTokenAndAdmin,
     
} = require('../middleware/jwt_helper')

const {
     authenticateUser,
     authorizePermissions,
} = require('../middleware/authentication')

router
.route('/')
.get(verifyToken,getAllDoctors)


router
.route('/:id')
.get(verifyToken,getOneDoctor)
.patch(verifyToken,updateDoctor)
.delete(verifyToken,deleteDoctor)






module.exports = router;