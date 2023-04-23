const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
     destination: './public/upload',
     filename: (req, file, cb) => {
         return cb(null,` ${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
     }
   });
   
   const fileFilter = (req, file, cb) => {
     let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"]
     if(!allowedMimeTypes.includes(file.mimetype)){
         return cb(new CustomError("Please provide a valid image file", 400), false)
     }
   
     return cb(null, true);
   
   };


   const upload = multer({storage, fileFilter,fileSize: 1024 * 1024 * 5}).single('image')



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


const updateImage = async (req, res) => {
     upload(req, res, (err) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ message: "Error uploading image" });
          }
          User.findById(req.params.id, (err, user) => {
            if (err) {
              console.log(err);
              return res.status(400).json({ message: "User not found" });
            }
            user.image = req.file.filename;
            user.save((err) => {
              if (err) {
                console.log(err);
                return res.status(400).json({ message: "Error updating user" });
              }
              return res.status(200).json({ message: "User image updated successfully" });
            });
          });
        });
}



module.exports = {
     getOneDoctor,
     getAllDoctors ,
     updateImage 
}