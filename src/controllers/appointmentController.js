const Appointment = require('../models/Appointment')
const CustomError = require("../errors");
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../constant/index')
const pusher = require('../controllers/notificationController');
const sendEmail = require('../utils/mail')





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

     // Push notification to the doctor channel
     const channelName = `doctor_${doctor}`;
     const eventData = {
          appointment: savedAppointment,
          user: savedAppointment.user
     };
     setTimeout(() => {
          pusher.trigger(channelName, 'appointment_created', eventData);
     }, 4 * 60 * 1000); // 4 minutes delay



     // Send email notification to the user
     const title = `Your booking appointment with ${savedAppointment.doctor} at ${savedAppointment.day}${savedAppointment.time} has been scheduled. Thank you. The Vhealth Team`;





     await sendEmail(savedAppointment.user.email, "Appointment Booked", title);
     res.status(StatusCodes.CREATED).json({ message: 'Appointment created Check your mail', appointment: savedAppointment });
}


const getAppointments = async (req, res, next) => {

     const appointments = await Appointment.find();
     res.status(StatusCodes.OK).json({
          count: appointments.length,
          appointments
     });

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

const getAppointmentsByUser = async (req, res, next) => {
     const { user } = req.body;

     if (!mongoose.Types.ObjectId.isValid(user)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user ID' });
     }

     const userId = await User.findById(user);

     if (!userId) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
     }

     const appointments = await Appointment.find({ user: user });

     res.status(StatusCodes.OK).json({
          count: appointments.length,
          appointments
     });
};


const getAppointmentsByDoctor = async (req, res, next) => {
     const { doctor } = req.body;

     if (!mongoose.Types.ObjectId.isValid(doctor)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid doctor ID' });
     }

     const doctorId = await User.findById(doctor);

     if (!doctorId) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Doctor not found' });
     }

     const appointments = await Appointment.find({ doctor: doctor });

     res.status(StatusCodes.OK).json({
          count: appointments.length,
          appointments
     });
};


const acceptAppointment = async (req, res, next) => {
     try {
          const { id } = req.body;

          const appointment = await Appointment.findById(id);

          if (!appointment) {
               throw new CustomError.NotFoundError('No appointment found');
          }

          await Appointment.updateOne(
               { _id: appointment._id },
               { $set: { status: APPOINTMENT_STATUS.ACCEPTED } }
          );


          // Send email notification to the user
          const title = `Your booking appointment with ${appointment.doctor} at ${appointment.day}${appointment.time} has been accepted. Thank you. The Vhealth Team`;


          await sendEmail(appointment.user.email, "Appointment Accepted", title);

          const userId = appointment.user; // assuming you have a user id in your appointment model
          const message = `Your appointment with id ${appointment._id} has been accepted.`;

          pusher.trigger(`user-${userId}`, 'appointment-accepted', { message });
          console.log(pusher);
          res.status(StatusCodes.OK).json({
               message: `Appointment with id ${appointment._id} has been accepted`,
          });
     } catch (error) {
          next(error);
     }
};



const rejectAppointment = async (req, res) => {

     try {
          const { id } = req.body;

          const appointment = await Appointment.findById(id);

          if (!appointment) {
               throw new CustomError.NotFoundError('No appointment found');
          }

          await Appointment.updateOne(
               { _id: appointment._id },
               { $set: { status: APPOINTMENT_STATUS.REJECTED } }
          );


          const title = `Your booked appointment with ${appointment.doctor} at ${appointment.day}${appointment.time} has been rejected. Thank you. The Vhealth Team`;


          await sendEmail(appointment.user.email, "Appointment Accepted", title);


          const userId = appointment.user;
          const message = `Your appointment with id ${appointment._id} has been rejected.`;

          pusher.trigger(`user-${userId}`, 'appointment-rejected', { message });

          res.status(StatusCodes.OK).json({
               message: `Appointment with id ${appointment._id} has been rejected`,
          });
     } catch (error) {
          next(error);
     }
};








module.exports = {
     createAppointment,
     getAppointments,
     getAppointmentById,
     updateAppointment,
     deleteAppointment,
     getAppointmentsByUser,
     getAppointmentsByDoctor,
     acceptAppointment,
     rejectAppointment
}