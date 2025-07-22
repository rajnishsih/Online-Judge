import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  // this is main logic for registering

  // collecting the data

  try {
    //getting all the data from frontend
    const { firstname, lastname, email, password } = req.body;
    //check if all the data exist
    if (!(firstname && lastname && email && password)) {
      return res.status(400).json({
        success:false,
        message:"Provide all required information"
      });
    }
    //validation

    //check if user alerdy exist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success:false,
        message:"User with this email already exists"
      });
    }

    //hashing the password
    const saltRounds = 12; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //save the user in the db
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    //generate a token for user and it is used for session
    const token = jwt.sign({ id: user._id, email:user.email }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    const userResponse = {
      _id:user._id,
      firstname:user.firstname,
      lastname:user.lastname,
      email:user.email,
      createdAt:user.createdAt
    }

    res.status(200).json({
      success:true,
      message:"User registered successfully",
      user:userResponse,
      token:token
    })
  } catch (error) {
    console.log("error while regisetring", error.message);
    res.status(500).json({
      success:false,
      message:"Internal server error during registration",
      error:error.message
    })
  }
};

export const login = async (req, res) => {
  try {
    //getting data
    const { email, password } = req.body;
    //check if all the data exist
    if (!(email && password)) {
      return res.status(400).json({
        success:false,
        message:"Please provide both email and password"
      });
    }
    //check if user is registered or not
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    const userResponse = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "Login successful!",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Internal server error during login"
    })
  }
};
