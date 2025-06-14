require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const Sentiment = require("sentiment"); // Added sentiment library

const app = express();
const PORT = process.env.PORT || 5000;

const sentiment = new Sentiment(); // Initialize sentiment

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.json());

// ✅ Debugging: Ensure environment variables are loaded
if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.RECEIVER_EMAIL
) {
  console.error("❌ Missing required environment variables in .env file!");
  process.exit(1);
}

// ✅ Simulated Database (Replace with PostgreSQL later)
const usersDB = {};
const remindersDB = [];

// ✅ Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
  },
});

// ✅ Register Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  if (usersDB[email]) {
    return res
      .status(400)
      .json({ message: "⚠️ User already exists. Please login." });
  }

  usersDB[email] = { name, password };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "🆕 New User Registration",
    text: `A new user has registered:\n\n👤 Name: ${name}\n📧 Email: ${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "✅ Registration successful! Admin notified." });
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    res
      .status(500)
      .json({ message: "⚠️ Email could not be sent", error: error.message });
  }
});

// ✅ Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  const user = usersDB[email];

  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "⚠️ Invalid credentials. Please register first." });
  }

  res.status(200).json({
    message: "✅ Login successful!",
    user: { email, name: user.name },
  });
});

// ✅ Set Reminder Route with sentiment analysis
app.post("/set-reminder", (req, res) => {
  const { email, message, dateTime } = req.body;

  if (!email || !message || !dateTime) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  // Analyze sentiment of the message
  const result = sentiment.analyze(message);
  const mood =
    result.score > 0 ? "Positive" : result.score < 0 ? "Negative" : "Neutral";

  remindersDB.push({ email, message, dateTime, mood });

  res.status(200).json({
    message: "✅ Reminder set successfully!",
    mood,
  });
});

// ✅ Send Reminder Manually (If Needed)
app.post("/send-reminder", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ message: "❌ Email and message are required" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⏰ Mood Reminder Notification",
    text: `🔔 Reminder: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Reminder email sent successfully!" });
  } catch (error) {
    console.error("❌ Email Sending Error:", error.message);
    res
      .status(500)
      .json({ message: "⚠️ Email could not be sent", error: error.message });
  }
});

// ✅ Cron Job to Check Reminders Every Minute
cron.schedule("* * * * *", () => {
  const now = new Date().toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  remindersDB.forEach(async (reminder, index) => {
    if (reminder.dateTime.slice(0, 16) === now) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: "⏰ Mood Reminder Notification",
        text: `🔔 Reminder: ${reminder.message}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Reminder Email Sent to:", reminder.email);
        remindersDB.splice(index, 1); // Remove sent reminder
      } catch (error) {
        console.error("❌ Email Sending Error:", error.message);
      }
    }
  });
});

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
