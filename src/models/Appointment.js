const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
     doctor: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
     },
     user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
     },

     day: {
          type: String,
          required: true,
          validate: {
               validator: function (v) {
                    // Check if value is a valid weekday (Monday to Friday)
                    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
                    if (weekdays.includes(v)) {
                         return true;
                    }
                    // Check if value is a valid date (1st to 31st)
                    const dateRegex = /^([1-9]|[12]\d|3[01])$/;
                    return dateRegex.test(v);
               },
               message: props => `${props.value} is not a valid day format (weekday or date of the month)`
          }

     },
     time: {
          type: String,
          required: true,
          validate: {
               validator: function (v) {
                    return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(v);
               },
               message: props => `${props.value} is not a valid time format (HH:MM AM/PM)`
          }
     }
}, { timestamps: true });


module.exports = mongoose.model("Appointment", AppointmentSchema)