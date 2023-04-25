const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    type: user.type,
    userToken: user.token
  };
};

module.exports = createTokenUser;
