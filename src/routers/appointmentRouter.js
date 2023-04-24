const express = require('express')
const router = express.Router();



const {
     createAppointment,
     getAppointments,
     getAppointmentById,
     updateAppointment,
     deleteAppointment,
     getAppointmentsByUser,
     getAppointmentsByDoctor
} = require('../controllers/appointmentController')



router
     .route('/')
     .post(createAppointment)
     .get(getAppointments);



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



module.exports = router