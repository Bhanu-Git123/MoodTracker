import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const moodStyles = {
  happy: { color: "bg-yellow-300", emoji: "😊" },
  excited: { color: "bg-pink-300", emoji: "🤩" },
  neutral: { color: "bg-gray-300", emoji: "😐" },
  sad: { color: "bg-blue-300", emoji: "😔" },
  angry: { color: "bg-red-300", emoji: "😠" },
  tired: { color: "bg-purple-300", emoji: "😴" },
  anxious: { color: "bg-indigo-300", emoji: "😰" },
  depressed: { color: "bg-teal-300", emoji: "😥" },
};

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    const stored = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const filtered = stored.filter((entry) => entry.email === email);
    setMoodHistory(filtered);
  }, []);

  const clearHistory = () => {
    const email = localStorage.getItem("loggedInUser");
    const stored = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const remaining = stored.filter((entry) => entry.email !== email);
    localStorage.setItem("moodHistory", JSON.stringify(remaining));
    setMoodHistory([]);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Your Mood History
        </h2>
        <div className="space-x-3">
          <button
            onClick={() => navigate("/mood-analysis")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            Mood Analysis
          </button>
          <button
            onClick={() => navigate("/mood-reminder")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
          >
            Mood Reminder
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
          >
            Clear History
          </button>
        </div>
      </div>

      {moodHistory.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {moodHistory.map((entry, index) => {
            const style = moodStyles[entry.mood] || {
              color: "bg-gray-200",
              emoji: "❓",
            };
            return (
              <div
                key={index}
                className="p-6 rounded-xl shadow-lg bg-white hover:shadow-2xl transition flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full text-3xl font-bold text-white ${style.color} flex-shrink-0`}
                  title={
                    entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)
                  }
                >
                  {style.emoji}
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 capitalize">
                    {entry.mood}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {entry.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-700 text-lg mt-12">
          No mood history recorded yet.
        </p>
      )}
    </div>
  );
};

export default MoodHistory;
