const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const roomSchema = new mongoose.Schema({
     _id: {
          type: String,
          default: () => uuidv4().replace(/\-/g, ""),
     },

     participants: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     }],
     createdAt: {
          type: String,
          default: moment().format('MMMM Do YYYY, h:mm:ss a'),
     }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;