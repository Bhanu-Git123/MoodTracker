import React, { useState, useEffect } from "react";

const MoodReminder = () => {
  const [reminderTime, setReminderTime] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkReminder = setInterval(() => {
      const now = new Date().toISOString().slice(0, 16);
      const savedReminder = localStorage.getItem("reminderTime");
      if (savedReminder === now) {
        sendEmailNotification();
        localStorage.removeItem("reminderTime");
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkReminder);
  }, []);

  const handleSetReminder = async () => {
    if (!reminderTime || !email) {
      alert("Please enter email and select a reminder time.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/set-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message: "Your Mood Reminder!",
          dateTime: reminderTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("reminderTime", reminderTime);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      alert("⚠️ Failed to set reminder. Please try again later.");
    }
  };

  const sendEmailNotification = async () => {
    try {
      await fetch("http://localhost:5000/send-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      alert("Reminder email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold text-black">Set a Mood Reminder</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full mt-2 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        className="border p-2 w-full mt-2 text-black"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      />
      <button
        onClick={handleSetReminder}
        className="mt-2 p-2 bg-purple-500 text-white rounded-md w-full"
      >
        Set Reminder
      </button>
    </div>
  );
};

export default MoodReminder;
