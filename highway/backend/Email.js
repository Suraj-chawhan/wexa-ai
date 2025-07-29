const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,    
  },
});

// ✅ Send OTP email
const sendOTPEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:sans-serif;">
          <h2>🔐 Your OTP is: <span style="color:#4CAF50">${otp}</span></h2>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", to);
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOTPEmail };
