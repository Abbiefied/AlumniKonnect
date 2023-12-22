const emailHelper = require("../helpers/email");

exports.contactFormSubmit = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validate form fields
    if (!firstName || !lastName || !email || !message) {
      req.flash('error', 'Please fill in all required fields.');
      return res.status(400).json();
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      req.flash('error', 'Please enter a valid email address.');
      return res.status(400).json();
    }

    const mailOptions = {
      from: email,
      to: "contact@alumnikonnect.com",
      subject: "New Contact Form Submission",
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    await emailHelper.sendEmail(mailOptions);

    req.flash('success_msg', 'Email sent successfully!');
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error sending email.');
    return res.status(500).json();
  }
};
