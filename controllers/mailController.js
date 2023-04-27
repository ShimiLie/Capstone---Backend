const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/user");

exports.mailSend = (req, res) => {
  const mailOptions = {
    to: User.email,
    from: "softwaretest94@gmail.com",
    subject: "Hopefully I am not making you uncomfortable",
    text: "Please do be reminded to take some time off and observe an object/image/drawing and do a quick doodle before posting it in your Journal!",
  };

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

  cron.schedule("5 * * * * *", () => {
    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent");
      }
    });
  });
};
