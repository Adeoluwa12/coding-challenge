const User = require('../models/User');
const CustomError = require("../errors");
const { ACCOUNT_TYPES } = require('../constant');
const { StatusCodes } = require('http-status-codes');




const validatePasswordString = (password) => {
     const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

     if (!password.match(regex)) {
          throw new CustomError.BadRequestError(
               'Password must contain a capital letter, number, special character & greater than 8 digits.',
          );
     }
}


//Create Doctors
const create = async (req, res) => {
     const {
          email,
          number,
          fullName,
          specialization,
          password,
          years_of_exp,
          demography,

     } = req.body;

     validatePasswordString(password);


     const numberExit = await User.findOne({ number })
     if (numberExit) {
          throw new CustomError.BadRequestError(` number exit`)
     }

     const emailExit = await User.findOne({ email })
     if (emailExit) {
          throw new CustomError.BadRequestError(` email exit`)
     }




     let user = await User.create({
          email,
          number,
          fullName,
          specialization,
          password,
          years_of_exp,
          demography,
          type: ACCOUNT_TYPES.DOCTOR,
     })


     const token = user.createJWT()

     res.status(StatusCodes.OK).json({
          user: {
               _id: user._id,
               title: user.title,
               fullname: user.fullName,
               specialization: user.specialization,
               type: user.type,
               email: user.email,
               number: user.number,
               years_of_exp: user.years_of_exp,
               demography: user.demography
          },

          token
     })


}

//login controller


const login = async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          throw new CustomError.BadRequestError("Please provide email and password");
     }

     const user = await User.findOne({ email })


     if (!user) {
          throw new CustomError.UnauthenticatedError("Invalid Credentials");
     }

     const isPasswordCorrect = await user.comparePassword(password);

     if (!isPasswordCorrect) {
          throw new CustomError.UnauthenticatedError('Invalid Credentials');
     }

        

     const token = user.createJWT()
     
     res.status(StatusCodes.OK).json({
          user: {
               title: user.title,
               fullname: user.fullName,
               specialization: user.specialization,
               type: user.type,
               email: user.email,
               number: user.number,
               image: user.image
          },
           token,
     });
};




module.exports = {
     create,
     login
}