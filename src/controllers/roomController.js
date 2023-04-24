const Room = require('../models/Room');
const { StatusCodes } = require('http-status-codes');
const CustomError = require("../errors");


// Create a new room

const createRoom = async (req, res) => {

     const newRoom = new Room({
          participants: [req.body.senderId, req.body.recevierId]
     });

     const savedRoom = await newRoom.save();
     // Emit socket event to all clients with updated room list
     req.app.get('socketio').emit('updateRooms');

     res.status(StatusCodes.CREATED).json({ message: 'Room created successfully', savedRoom });

}



// Get all rooms

const getAllRooms = async (req, res) => {
     const rooms = await Room.find().sort({ createdAt: -1 });
     res.json({ rooms });

}

module.exports = {
     createRoom,
     getAllRooms
}