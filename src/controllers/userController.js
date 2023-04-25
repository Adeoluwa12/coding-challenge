const User = require('../models/User');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

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

  const result = await cloudinary.uploader.upload(file.path);

  const user = await User.findOneAndUpdate( 
    {
      _id: userId,
    },
     {
    image: result.secure_url
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


const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: `User with id ${id} has been deleted`,
  });
};





module.exports = {
  getOneUser,
  getAllUsers,
  updateImage,
  updateUser,
  deleteUser
}