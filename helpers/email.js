const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ganiyatadekunle165@gmail.com",
    pass: "uvsc jmjy frej grhb",
  },
});

module.exports = {
  sendEmail(options) {
    return transporter.sendMail(options);
  },
};
