const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");





const getAllDoctors  = async (req, res) => {
     const doctors = await User.find({ type: 'doctor'})
     .select("-password")

     res.status(StatusCodes.OK).json({
          success: true,
          count: doctors.length,
          doctors:doctors
     })
}


const getOneDoctor = async (req, res) => {
     const { id } = req.params;

     const doctor = await User.findById({ _id: id })
          .select("-password")




     if (!doctor) {
          throw new CustomError.NotFoundError(`No doctor with id: ${id}`);
     }
     res.status(StatusCodes.OK).json({
          success: true,
          doctor,
     }); 
}



const updateDoctor = async (req, res) => {
     const { id } = req.params;
   
     try {
       const doctor = await User.findByIdAndUpdate(
         id,
         { $set: req.body },
         { new: true }
       ).select("-password");
   
       if (!doctor) {
         throw new CustomError.NotFoundError(`No doctor with id: ${id}`);
       }
   
       res.status(StatusCodes.OK).json({
         success: true,
         doctor,
       });
     } catch (error) {
       next(error);
     }
   };


   const deleteDoctor = async (req, res) => {
     const { id } = req.params;
   
     try {
       const doctor = await User.findByIdAndDelete(id);
   
       if (!doctor) {
         throw new CustomError.NotFoundError(`No doctor with id: ${id}`);
       }
   
       res.status(StatusCodes.OK).json({
         success: true,
         message: "Doctor deleted successfully",
       });
     } catch (error) {
       next(error);
     }
   };
  
   
   
   
   
   
   
   


module.exports = {
     getOneDoctor,
     getAllDoctors ,
     updateDoctor,
     deleteDoctor
     
}