const express = require('express')
const router = express.Router();



const {
     createAppointment,
     getAppointments,
     getAppointmentById,
     updateAppointment,
     deleteAppointment
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



    module.exports = router