import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import log4js from 'log4js'

log4js.configure({
	appenders: { auth: { type: "file", filename: "logs.log" } },
	categories: { default: { appenders: ["auth"], level: "info" } },
});

const logger = log4js.getLogger("cheese");

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

	logger.info("Using register function for " + firstName + " " + lastName + " with email " + email + ".");

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
	// console.log(newUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
	logger.info("Using logging function for " + email + ".");
    const user = await User.findOne({ email: email });
    if (!user){
		logger.error("User does not exist.");
		return res.status(400).json({ msg: "User does not exist. " });
	}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
		logger.error("Invalid credentials.");
		return res.status(400).json({ msg: "Invalid credentials. " });
	}

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
	logger.info("User logged in successfully for + " + email + ".");
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
