const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError } = require('../errors')
//const User = require('../models/User')
const { ACCOUNT_TYPES } = require('../constant');




const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Token not provided" });
  }
};


const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.accountType === ACCOUNT_TYPES.ADMIN || req.user.id === req.params.id) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json("You are not allowed to perform this action!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.accountType === ACCOUNT_TYPES.ADMIN) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json("You are not allowed to perform this action!");
    }
  });
};



// const authenticationMiddleware = async (req, res, next) => {
//   // check header
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer')) {
//     throw new UnauthenticatedError('Token not valid');
//   }
//   const token = authHeader.split(' ')[1];

//   try {
//     // verify token
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     // check if the token is blacklisted
  
//     // attach the user to the request object
//     const user = await User.findById(payload.id).select('-password');
//     if (!user) {
//       throw new UnauthenticatedError('User not found');
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       throw new UnauthenticatedError('Token expired');
//     } else if (error instanceof jwt.JsonWebTokenError) {
//       throw new UnauthenticatedError('Token invalid');
//     } else {
//       next(error);
//     }
//   }
// };


module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  
};


