require('express-async-errors')
const dotenv = require('dotenv').config();
const path = require('path')

// // swaggerUI.setup
// const swaggerUI = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const version = require('./package.json')

// const swaggerOptions = {
//      swaggerDefinition: {
//        info: {
//          title: 'REST API Docs',
//          version: '1.0.0',
//          description: 'Telemedicine App'
//        },
//      //   basePath: "./app/*.js"
//      },
//      apis: ["./src/app.js/*.js", "./src/models/*.js"],
//    };


//    const swaggerDocs = swaggerJsdoc(swaggerOptions);

const express = require('express');
const app = express();



// Express packages

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
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
const appointmentRouter = require('./routers/appointmentRouter')



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



app.get("/", (req, res) => {
     res.json({ message: "Welcome to Telemedicine App" });
   
   });

//    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//    app.get("docs.json", (req, res) => {
//      res.setHeader("Content-Type", "application/json");
//      res.send(swaggerDocs)
//    })


   //USE routes

   app.use('/api/v1/auth/doctors', AuthDoctor);
   app.use('/api/v1/doctors', GetDoctor);
   app.use('/api/v1/ratings', RatingDoctor);
   app.use('/api/v1/auth/users', UserAuth);
   app.use('/api/v1/users', GetUser);
   app.use('/api/v1/appointments', appointmentRouter);
   
   




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