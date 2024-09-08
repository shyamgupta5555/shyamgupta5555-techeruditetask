const nodemailer = require('nodemailer');
require('dotenv').config(); // To use environment variables

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example: using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: 
           ${process.env.BASE_URL}/verify/${token}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendVerificationEmail
};
