const nodemailer = require('nodemailer');



const sendEmail = async ({ email, subject, text }) => {
     try {


          const transporter = nodemailer.createTransport({
               host: process.env.HOST,
               port: process.env.EMAIL_PORT,
               secure: true,
               auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
               },
          });

          await transporter.sendMail({
               from: `"VHealth" ${process.env.USER}`,
               to: email,
               subject: subject,
               text: text
          });

          console.log("email sent successfully");
     } catch (error) {
          console.log("email not sent");
          console.log(error);
     }
};

module.exports = sendEmail;
