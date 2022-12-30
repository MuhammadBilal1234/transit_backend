var jwt = require("jsonwebtoken");
var config = require("../config/config");

const generateToken = async (payload) => {
  var token = await jwt.sign({ user: payload }, config.secret);
  return token;
};

async function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware

    const { user } = await jwt.verify(bearerToken, config.secret);

    if (user) {
      req.user = user;
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
