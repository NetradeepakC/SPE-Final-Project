import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import log4js from 'log4js'

log4js.configure({
	appenders: { auth: { type: "file", filename: "logs.log" } },
	categories: { default: { appenders: ["auth"], level: "info" } },
});

const logger = log4js.getLogger("auth");

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

	logger.info("Using register function for " + firstName + " " + lastName + " with email " + email + " and password " + password + " and picture " + picturePath + " and location " + location + " and occupation " + occupation);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100000000),
      impressions: Math.floor(Math.random() * 100000000),
    });
    const savedUser = await newUser.save().then(() => {
		logger.info("User creation successful for " + email);
	});
	console.log(newUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
	logger.info("Using logging function for " + email);
    const user = await User.findOne({ email: email });
    if (!user){
		logger.error("User doesn't exist");
		return res.status(400).json({ msg: "User does not exist." });
	}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
		logger.error("Invalid credentials");
		return res.status(400).json({ msg: "Invalid credentials." });
	}

	logger.info("Login successful for " + email);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
