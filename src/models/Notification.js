const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     message: {
          type: String,
          required: true,
     },
     timestamp: {
          type: Date,
          default: Date.now,
     },

}, { timestamps: true });



module.exports = mongoose.model("Notification", NotificationSchema);