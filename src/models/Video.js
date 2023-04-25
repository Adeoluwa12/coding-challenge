const mongoose = require('mongoose');

const videoCallSchema = new mongoose.Schema({
     doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     roomId: {
          type: String,
          required: true,
          unique: true
     },
     status: {
          type: String,
          enum: ['calling', 'ongoing', 'completed'],
          default: 'calling'
     },
     startedAt: {
          type: Date
     },
     endedAt: {
          type: Date
     }
}, { timestamps: true });

const VideoCall = mongoose.model('VideoCall', videoCallSchema);

module.exports = VideoCall;
