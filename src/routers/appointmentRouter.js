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
  authenticationMiddleware
} = require('../middleware/jwt_helper')


router
     .route('/')
     .post(createAppointment)
     .get(authenticationMiddleware,getAppointments);



router
     .route('/:id')
     .get(getAppointmentById)
     .patch(updateAppointment)
     .delete(deleteAppointment);


router
     .route('/user')
     .post(getAppointmentsByUser);


router
     .route('/find/doctor')
     .post(getAppointmentsByDoctor);


router
     .route('/accept')
     .put(acceptAppointment);


router
     .route('/reject')
     .put(rejectAppointment);



module.exports = router