import genToken from "../config/token";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  try {
    // Validate User Data
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validate for username

    const existingUsername = await User.findOne({ userName });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // password length
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(salt);

      // Create User
      const newUser = await User.create({ userName, password: hashedPassword });

      const token = await genToken(newUser._id);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      console.log(newUser)

      res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Sign in Controllers
export const signIn = async (req, res) => {
  // username and password
  // need to verify if the user exists or not
  // bcrypt compare password
  // we allow the user to log in

  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "All fields Required" });
    }

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Password Incorret" });
    }

     const token =  await genToken(user._id)

     res.cookie('token', token , {
         httpOnly:true,
         sameSite:true,
         maxAge: 30*24*60*60*1000 // 30 days
     })


    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};