const Appointment = require('../models/Appointment')
const CustomError = require("../errors");
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');







const createAppointment = async (req, res, next) => {

     const { doctor, user, day, time } = req.body;
     const appointment = new Appointment({
          doctor: doctor,
          user: user,
          day: day,
          time: time
     });

     // Check if the doctor and user IDs are valid ObjectIDs
     const isValidDoctor = await User.findById(doctor);
     const isValidUser = await User.findById(user);
     if (!isValidDoctor || !isValidUser) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid doctor or user ID' });
     }

     const savedAppointment = await appointment.save();
     res.status(StatusCodes.CREATED).json({ message: 'Appointment created successfully', appointment: savedAppointment });
}


const getAppointments = async (req, res, next) => {

     const appointments = await Appointment.find();
     res.status(StatusCodes.OK).json(appointments);

};

const getAppointmentById = async (req, res, next) => {

     const { id } = req.params;
     const appointment = await Appointment.findById(id);
     if (!appointment) {
          throw new CustomError.NotFoundError('Appointment not found');
     }
     res.status(StatusCodes.OK).json({ appointment });

};


const updateAppointment = async (req, res, next) => {

     const { id } = req.params;
     const { doctor, user, day, time } = req.body;

     // Check if the doctor and user IDs are valid ObjectIDs
     const isValidDoctor = await User.findById(doctor);
     const isValidUser = await User.findById(user);
     if (!isValidDoctor || !isValidUser) {
          throw new CustomError.NotFoundError('Doctor or user ID not found');
     }

     // Update the appointment fields
     const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
          doctor: doctor,
          user: user,
          day: day,
          time: time
     }, { new: true });

     if (!updatedAppointment) {
          throw new CustomError.NotFoundError('Appointment not found');
     }

     res.status(StatusCodes.OK).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });

};



const deleteAppointment = async (req, res, next) => {

     const { id } = req.params;
     const deletedAppointment = await Appointment.findByIdAndDelete(id);
     if (!deletedAppointment) {
          throw new CustomError.NotFoundError('Appointment not found');
     }
     res.status(StatusCodes.OK).json({ message: 'Appointment deleted successfully' });
}

module.exports = {
     createAppointment,
     getAppointments,
     getAppointmentById,
     updateAppointment,
     deleteAppointment
}