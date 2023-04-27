const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;

const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth/auth"); //call authrouter
const postRouter = require("./routes/posts/posts"); //call postrouter
const userRouter = require("./routes/user/user"); //call userrouter
mongoose.set("strictQuery", false);

let dbConnect = require("./dbConnect");

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
//call the routes
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.write("Hello World!");
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/user");

const mailOptions = {
  from: "softwaretest94@gmail.com",
  to: "anthonylie94@gmail.com",
  subject: "Hopefully I am not making you uncomfortable",
  text: "Please do be reminded to take some time off and observe an object/image/drawing and do a quick doodle before posting it in your Journal!",
};

let transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

cron.schedule(" * * 5 * *", () => {
  console.log("email sent");
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent" + info.response);
    }
  });
});
