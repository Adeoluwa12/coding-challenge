const Room = require('../models/Room');
const { StatusCodes } = require('http-status-codes');
const CustomError = require("../errors");


// Create a new room

const createRoom = async (req, res) => {

     const newRoom = new Room({
          participants: [req.body.senderId, req.body.recevierId]
     });



     if (!req.body.senderId || !req.body.recevierId) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'senderId and recevierId are required' });
     }




     const savedRoom = await newRoom.save();
     // Emit socket event to all clients with updated room list
     req.app.get('socketio').emit('updateRooms');

     res.status(StatusCodes.CREATED).json({ message: 'Room created successfully', savedRoom });

}



// Get all rooms

const getAllRooms = async (req, res) => {
     const rooms = await Room.find().sort({ createdAt: -1 });
     res.status(StatusCodes.OK).json({ rooms });



}

// get conv includes two userId

const getTwoUserConversations = async (req, res) => {

     const { firstId , secondId } = req.body;

     const conversation = await Room.findOne({
       members: { $all: [ firstId, secondId ] }
     });

     if(!conversation) {
          throw new CustomError.NotFoundError(`conversation not found`);
     }

     res.status(StatusCodes.OK).json({
          message: `true`,
          conversation
     })
}

// Get Conversion of a User;

const getOneUSerConversation = async (req, res) => {

     const {  userId } = req.body;;

  const conversation = await Room.find({
     members: { $in:  [  userId ] }
});

if (!conversation) {
     throw new CustomError.NotFoundError(`conversation not found`);
}
  res.status(StatusCodes.OK).json({
     message: `true`,
     conversation
});
};


module.exports = {
     createRoom,
     getAllRooms,
     getTwoUserConversations,
     getOneUSerConversation
}