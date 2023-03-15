const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const User = require("../models/User");

exports.register = async (req, res, next) => {
  console.log("Register", req.body);
  const { username, email, password, role } = req.body;
  console.log("Register", req.body);
  if (!username || !email || !password || !role)
    return res.status(400).send("Please fill in all the required fields!");
  try {
    const userObj = { username, email, role, password, profile: {} };
    const hashedPwd = await hash(password, 12);
    console.log("hashedPwd", hashedPwd);
    userObj.password = hashedPwd;
    console.log("userObj", userObj);
    const user = await new User(userObj).save();
    const token = sign({ [role]: user }, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    return res
      .status(201)
      .json({ token, user: { ...user._doc, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Userinfo", email, password);
  try {
    const user = await User.findOne({ email }).lean();
    console.log("User", user);
    if (!user) return res.status(404).send("Invalid credentials");
    // if (user.role !== "user")
    //   return res.status(404).send("Invalid credentials..");
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const token = sign({ user }, process.env.JWT_SECRET, { expiresIn: 360000 });
    return res.status(200).json({ token, user: { ...user, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getUsers = async (req, res, next) => {
  console.log("req", req.user);
  try {
    const user = await User.find();
    if (!user)
      return res.status(400).send("User not found, Authorization denied..");
    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { id } = req.params;
  console.log("Updating ID:: >>", id);
  try {
    const user = await User.findById(id).lean();
    if (!user) return res.status(400).send("User does not exist");
    const userObj = { ...req.body };
    if (req.body.password) {
      const hashedPWD = await hash(req.body.password, 12);
      userObj.password = hashedPWD;
    }
    const newUser = await User.findByIdAndUpdate(
      { _id: id },
      { ...userObj },
      { new: true }
    );
    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
};

exports.deleteUserProfile = async (req, res, next) => {
  const { id } = req.params;
  console.log("ID::", id);
  try {
    await User.findByIdAndDelete({_id: id});
    return res.status(200).send("User has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
};
