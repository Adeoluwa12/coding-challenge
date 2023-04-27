require('express-async-errors')
const dotenv = require('dotenv').config();
const path = require('path')
const Room = require('./models/Room');
const VideoCall = require('./models/Video');
const Chat = require('./models/Chat');




const express = require('express');
const app = express();





const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
     cors: {
          origin: '*',
     },
});


// set socketio object on app
app.set('socketio', io);


// Express packages

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");


//Database
const connectDB = require("./DB/connect");

//IMPORT ROUTERS

const AuthDoctor = require('./routers/doctorAuthRouter')
const GetDoctor = require('./routers/doctorRouter');
const RatingDoctor = require('./routers/ratingRouter')
const UserAuth = require('./routers/userAuthRouter');
const GetUser = require('./routers/userRouter');
const appointmentRouter = require('./routers/appointmentRouter');
const roomRouter = require('./routers/roomRouter');
const passwordRouter = require('./router/passwordRouter')



// Middlewares     completedDeliveriesRouter
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser(process.env.JWT_COOKIE));
app.use(bodyParser.urlencoded({ extended: true }))



app.use(express.static(path.join(__dirname, "./public")));
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.json());


io.on('connection', (socket) => {
     console.log('A user connected');

     // Handle chat message event
     socket.on('sendMessage', async ({ senderId, recipientId, message }) => {
          try {
               const chat = new Chat({
                    sender: senderId,
                    recipient: recipientId,
                    message
               });
               await chat.save();
               io.to(recipientId).emit('message', chat);
          } catch (error) {
               console.log(error);
          }
     });
     // Handle video call events
     socket.on('call', async ({ from, to, signalData }) => {
          try {
               const roomId = `${from}-${to}`;
               const videoCall = new VideoCall({
                    doctor: from,
                    user: to,
                    roomId
               });
               await videoCall.save();
               io.to(to).emit('incomingCall', { signalData, from, roomId });
          } catch (error) {
               console.log(error);
          }
     });

     socket.on('answerCall', (data) => {
          console.log('Answer call:', data);
          io.to(data.to).emit('callAccepted', data.signal);
     });

     // Handle disconnection event
     socket.on('disconnect', () => {
          console.log('A user disconnected');
     });

     // Join a room when the user requests to join the call
     socket.on("join-room", async (roomId, userId) => {
          console.log(`User ${userId} has joined room ${roomId}`);
          socket.join(roomId);

          // Retrieve the room from the database and add the user to the list of participants
          const room = await Room.findById(roomId);
          room.participants.push(userId);
          await room.save();
     });
});



app.post('/api/v1/chat', async (req, res) => {
     const { sender, recipient, message, roomId } = req.body;

     // Create a new chat object with the provided data
     const newChat = new Chat({
          roomId,
          sender,
          recipient,
          message,
     });

     // Save the new chat object to the database
     await newChat.save();

     // Emit the new message event to the recipient client
     io.to(recipient).emit("newMessage", newChat);

     res.status(200).json({ success: true, newChat }); 
});


app.post('/api/v1/video-call', async (req, res) => {
     try {
          const { doctor, user, signalData } = req.body;
          const roomId = `${doctor}-${user}`;
          const videoCall = new VideoCall({
               doctor,
               user,
               roomId
          });
          await videoCall.save();
          io.to(user).emit('incomingCall', { signalData, doctor, roomId });
          res.status(200).json({ success: true });
     } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, error: 'Server error' });
     }
});







app.get("/", (req, res) => {
     res.json({ message: "Welcome to Telemedicine App" });

});




//USE routes

app.use('/api/v1/auth/doctors', AuthDoctor);
app.use('/api/v1/doctors', GetDoctor);
app.use('/api/v1/ratings', RatingDoctor);
app.use('/api/v1/auth/', UserAuth);
app.use('/api/v1/users', GetUser);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/rooms', roomRouter);
app.use("/api/v1/auth/password", passwordRouter)






//ErrorHandlerMiddleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");



app.set("trust proxy", 1);
app.use(
     rateLimiter({
          windowMs: 15 * 60 * 1000,
          max: 60,
     })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());




app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



//port
const port = process.env.PORT || 5000;

const start = async () => {
     try {
          await connectDB(process.env.MONGO_URI);
          app.listen(port, () => {
               console.log(`listing on port ${port}...`);
          });
     } catch (error) {
          console.log(error);
     }
};

start();