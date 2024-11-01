const express = require("express");
const AuthClass = require("../controller/authController");
const { verifyToken, isAdmin } = require("../middlewares/jwtMiddleware");
const routes = express.Router();

routes.post("/register", AuthClass.registerController);
routes.post("/login", AuthClass.loginController);
///////////////////////////////////////
///protected route for user
routes.get("/verify-user", verifyToken, (req, res) => {
  res.status(200).send({ ok: true });
});
///protected route for admin
routes.get("/verify-admin", verifyToken, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
/////////////////////////////////////////
//getting user for showing in updqate component in client side
routes.get("/get-user", verifyToken, AuthClass.getUserController);
//update profile
routes.put("/update-profile", verifyToken, AuthClass.updateProfileController);
//get all users(ADMIN)
routes.get("/get-users", verifyToken, isAdmin, AuthClass.getAllUsers);
module.exports = routes;
