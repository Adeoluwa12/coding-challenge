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


   const getAllUsers = async ( req, res) => {
     const users = await User.find({ type: 'user'})
     .select("-password")
     .select("-patients")

     res.status(StatusCodes.OK).json({
          success: true,
          count: users.length,
          users:users
     })
   }


   const getOneUser = async (req, res) => {
     const { id } = req.params;

     const user = await User.findById({ _id: id })
          .select("-password")
          .select("-patients")




     if (!user) {
          throw new CustomError.NotFoundError(`No user with id: ${id}`);
     }
     res.status(StatusCodes.OK).json({
          success: true,
          user,
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
     getOneUser,
     getAllUsers ,
     updateImage 
}