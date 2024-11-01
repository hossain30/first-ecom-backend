const UserModel = require("../models/authModel");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  // Agar token nahi mila, toh unauthorized error bhejo
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // "Bearer" ke saath token hai toh sirf token nikaalo
  const authToken = token.split(" ")[1];

  // Token ko verify karo
  jwt.verify(authToken, "hi", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Agar token valid hai toh decoded data ko request mein daal do
    req.userId = decoded.userId;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await UserModel.findById(req.userId);

  if (user?.role !== "admin") {
    return res.status(401).send({ success: false, message: "Unauthorized access" });
  } else {
    next();
  }
};

// Export the functions for use in other files
module.exports = {
  verifyToken,
  isAdmin,
};
