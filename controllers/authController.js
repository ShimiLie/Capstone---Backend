const { JsonWebTokenError } = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middleware/token");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ msg: "Please input all fields" });
    }
    //check if user exists
    const useremail = await User.findOne({ email });
    if (useremail)
      return res.status(400).json({
        msg: "This email has been taken",
      });
    //hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);
    //create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    await user.save();

    res.json({
      msg: "Registered Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ msg: "Please input all fields" });
    }
    const user = await User.findOne({ email }); //find user
    if (!user) return res.status(400).json({ msg: "This user does not exist" });

    //match password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" });
    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    //add cookie
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30
    });

    res.json({
      msg: "login Success",
      access_token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refreshtoken;
    if (refresh_token) return res.status(400).json({ msg: "Please login now" });

    JsonWebTokenError.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now" });

        const user = await User.findById(result.id)
          .select("-password")
          .populate("_id name pic");

        if (!user)
          return res.status(400).json({ msg: "This user does not exist" });

        const access_token = createAccessToken({ id: result.id });

        res.json({
          access_token,
          user,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.resetPassword = (req, res) => {
  let smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) res.status(400).json({ msg: "token is invalid" });

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user)
        return res
          .status(422)
          .json({ msg: "User does not exist with this email" });

      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;

      user.save().then((result) => {
        smtpTransport.sendMail({
          to: user.email,
          from: "softwaretest94@gmail.com",
          subject: "Reset Password",
          html: `
                <h4>You requested for a password Reset</h4>
                <h5>Click on this <a href="${process.env.RESET}/reset/${token}">link</a> to reset your password </h5>
                `,
        });
        res.json({ msg: "Check your email" });
      });
    });
  });
};

exports.newPassword = (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  User.findOne({
    resetToken: sentToken,
    expireToken: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      if (!user)
        return res.status(422).json({ msg: "User does not exist this email" });

      //hash password
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password == hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({
            msg: "Password Reset successful. Login with your new password!",
          });
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({ msg: "Something went wrong!" });
    });
};
