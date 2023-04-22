const jwt = require('jsonwebtoken')
const CustomError = require("../errors");
const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError } = require('../errors')
const User = require('../models/User')



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.accessToken;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_EXPIRE, (err, user) => {
      if (err) res.status(StatusCodes.FORBIDDEN).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json("You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json("You are not alowed to do that!");
    }
  });
};



const authenticationMiddleware = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Token not valid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes

    const user = User.findById(payload.id).select('-password')
    req.user = user

    //req.user = { userId: payload.userId, type: payload.type }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}


module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  authenticationMiddleware
};


