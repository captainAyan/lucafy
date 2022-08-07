const jwt = require("jsonwebtoken");

module.exports = (data) =>
  jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
