const User = require("../models/User");
const { ACCOUNT_TYPES } = require('../constant');
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");




const validatePasswordString = (password) => {
     const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

     if (!password.match(regex)) {
          throw new CustomError.BadRequestError(
               'Password must contain a capital letter, number, special character & greater than 8 digits.',
          );
     }
}



//Create User
const create = async (req, res) => {
     const {
          email,
          number,
          fullName,
          password,

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
          password,


     })


     const token = user.createJWT()

     res.status(StatusCodes.OK).json({
          user: {
               _id: user._id,
               fullname: user.fullName,

               type: user.type,
               email: user.email,
               number: user.number,
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
               _id: user._id,
               fullname: user.fullName,

               type: user.type,
               email: user.email,
               number: user.number,
          },
          token,
     });
};




const logout = async (req, res) => {
     res.cookie("token", "logout", {
          httpOnly: true,
          expires: new Date(Date.now() + 1000),
     });
     res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};







module.exports = {
     create,
     logout,
     login
}