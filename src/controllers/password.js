
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../utils/sendEmail");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");


const getOtpExpiryTime = () => {
     return new Date(new Date().getTime() + 1000 * 60 * 10); // 10 mins
}

const forgetPassword = async (req, res, next) => {
     const { email } = req.body;

     const user = await User.findOne({ email: email });
     console.log(email);
     if (!user) {

          throw new CustomError.NotFoundError(`No email found`);
     };

     //Generate OTP
     const OTP = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
     });

     console.log(OTP);
     const salt = await bcrypt.genSalt(16)
     otpHashed = await bcrypt.hash(OTP, salt)

     const otp = await Otp.create({
          userId: user,
          otp: otpHashed,
          otp_expires_at: getOtpExpiryTime()
     });



     await otp.save();


     const title = `Password Reset Token ${OTP}, copy and paste your reset otp and rest your  password ,
         '`


     await sendEmail(user.email, "Reset your password with this Otp", title)


     console.log(title);
     res.status(StatusCodes.OK).json({

          message: "Otp sent to your mail",
     });
}





const resetPassword = async (req, res) => {
     const { userId, otp, newpassword } = req.body;

     if (!userId || !otp) {
          throw new CustomError.NotFoundError(`Empty otp details are not allowed`);
     } else {
          const otp_instance = await Otp.find({
               otp: req.body.otp
          });

          if (otp_instance != otp_instance) {

               throw new CustomError.NotFoundError(
                    `Empty otp details are not allowed`
               );
          } else {


               const salt = await bcrypt.genSalt(16)
               const hashedpw = await bcrypt.hash(newpassword, salt)
               await User.updateOne({ _id: userId },
                    { password: hashedpw },);


               await Otp.updateOne({ _id: otp_instance }, { otp_expires_at: null })


               await Otp.deleteMany({ userId });
          }
     }



     res.status(StatusCodes.OK).json({
          message: " password reset  successful"
     });
};


module.exports = {

     resetPassword,
     forgetPassword
}
