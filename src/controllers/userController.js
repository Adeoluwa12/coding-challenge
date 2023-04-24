const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { body, validationResult } = require('express-validator');



const getAllUsers = async (req, res) => {
  const users = await User.find({ type: 'user' })
    .select("-password")
    .select("-patients")

  res.status(StatusCodes.OK).json({
    success: true,
    count: users.length,
    users: users
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


  const file = req.file;

  if (!file) throw new CustomError.NotFoundError("Please upload an image");


  const { id:  userId } = req.params;

  const user = await User.findOneAndUpdate( 
    {
      _id: userId,
    },
     {
    image: req.file.path
  },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new CustomError.NotFoundError(`No order with id: ${userId}`);
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Image Upload Succesfull",
    data: user,
  });


};






module.exports = {
  getOneUser,
  getAllUsers,
  updateImage
}