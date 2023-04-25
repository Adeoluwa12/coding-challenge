const express = require('express')
const router = express.Router();



const {
     createAppointment,
     getAppointments,
     getAppointmentById,
     updateAppointment,
     deleteAppointment,
     getAppointmentsByUser,
     getAppointmentsByDoctor,
     acceptAppointment,
     rejectAppointment
} = require('../controllers/appointmentController')

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
     .post(verifyToken,authorizePermissions('user', 'doctor'),createAppointment)
     .get(verifyToken, getAppointments);



router
     .route('/:id')
     .get(verifyToken, getAppointmentById)
     .patch(verifyToken, updateAppointment)
     .delete(verifyToken, deleteAppointment);


router
     .route('/user')
     .post(verifyToken,getAppointmentsByUser);


router
     .route('/find/doctor')
     .post(verifyToken,getAppointmentsByDoctor);


router
     .route('/accept')
     .put(verifyToken,acceptAppointment);


router
     .route('/reject')
     .put(verifyToken,rejectAppointment);



module.exports = router