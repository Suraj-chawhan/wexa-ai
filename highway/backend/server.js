const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./models/User");
const Note = require("./models/Note");
const { sendOTPEmail } = require("./Email");

require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => res.send("Notes App Running 🚀"));

// ✅ Send OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email, name, dob } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, dob });
    }

    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    console.log(`OTP for ${email}: ${otp}`);
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Server error while sending OTP" });
  }
});

// ✅ Verify OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = "";
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
console.log("User"+user)
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Server error during OTP verification" });
  }
});
// ✅ Check if email exists before Sign In
app.get("/check-email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ exists: false, message: "User not found" });
    }

    res.json({ exists: true, message: "User exists" });
  } catch (err) {
    console.error("Email check error:", err);
    res.status(500).json({ error: "Server error checking email" });
  }
});



// ✅ Auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ Get Notes for specific user
app.get("/notes/:userId", auth, async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.userId)
    return res.status(403).json({ error: "Access denied" });

  try {
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Create Note
app.post("/notes", auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  try {
    const note = new Note({ userId: req.userId, content });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ✅ Delete Note
app.delete("/notes/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// ✅ Start server
app.listen(4000, () => {
  console.log("Server running on port 4000 🚀");
});
