const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const {  userId, type } = isTokenValid({ token });
    req.user = {  userId, type };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...allowedAccountTypes) => {
  return (req, res, next) => {
    const userAccountType = req.user.type;

    if (!allowedAccountTypes.includes(userAccountType)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
