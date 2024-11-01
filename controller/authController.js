const UserModel = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
class AuthClass {
  //////////REGISTRATION
  static registerController = async (req, res) => {


    const { name, email, password, cPassword, phone, address } = req.body;

    try {
      if (!name || !email || !password || !cPassword || !phone || !address) {
        return res
          .status(400)
          .send({ success: false, message: "All fields are required" });
      }
      if (password !== cPassword) {
        return res.status(400).send({
          success: false,
          message: "Password and Confirm Password not match",
        });
      }
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          success: false,
          message: "User already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const saveUser = await new UserModel({
          name,
          email,
          password: hashedPassword,
          phone,
          address,
        }).save();

        return res
          .status(201)
          .send({ success: true, message: "Succesfully registered" });
      }
    } catch (error) {


      return res
        .status(500)
        .send({ success: false, message: "Error while registering" });
    }
  };

  //////////LOGIN
  static loginController = async (req, res) => {
 

    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .send({ success: false, message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(400).send({
          success: false,
          message: "User not exists",
        });
      }
      const comparedPass = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!comparedPass) {
        return res
          .status(400)
          .send({ success: false, message: "Email or Password not match" });
      }
      if (comparedPass) {
        const token = jwt.sign({ userId: existingUser._id }, "hi", {
          expiresIn: "2d",
        });
        const { name, email, phone, address, role } = existingUser;
        return res.status(200).send({
          success: true,
          message: " Successfully login",
          token,
          user: {
            name,
            email,
            phone,
            address,
            role,
          },
        });
      }
    } catch (error) {


      return res
        .status(500)
        .send({ success: false, message: "Error while login" });
    }
  };
  //getting user for showing in updqate component in client side
  static getUserController = async (req, res) => {
    try {
      const existingUser = await UserModel.findById(req.userId).select(
        "-password -role"
      );
      if (!existingUser) {
        return res
          .status(404)
          .send({ success: false, message: "User not exists" });
      } else {


        return res.status(200).send({ success: true, user: existingUser });
      }
    } catch (error) {


      return res
        .status(500)
        .send({ success: false, message: "Error while getting user" });
    }
  };
  ////////update profile
  static updateProfileController = async (req, res) => {
    const { name, phone, address } = req.body;
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.userId, {
        $set: { name, phone, address },
      });
     

      res.status(200).send({ success: true, user: updatedUser });
    } catch (error) {
  

      return res
        .status(500)
        .send({ success: false, message: "Error while updating profile" });
    }
  };
  
  //get all users(ADMIN)
  
  static getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.find({}).sort({ createdAt: -1 });

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = AuthClass;
