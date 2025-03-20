import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    setMoodHistory(storedHistory);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Mood History</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/mood-analysis")}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Mood Analysis
          </button>
          <button
            onClick={() => navigate("/mood-reminder")}
            className="p-2 bg-green-500 text-white rounded-md"
          >
            Mood Reminder
          </button>
        </div>
      </div>
      {moodHistory.length > 0 ? (
        <div className="mt-4 space-y-3">
          {moodHistory.map((entry, index) => (
            <div
              key={index}
              className="p-4 border rounded-md bg-white dark:bg-gray-800"
            >
              <p className="text-lg font-medium">Mood: {entry.mood}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {entry.note}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No mood history recorded yet.</p>
      )}
    </div>
  );
};

export default MoodHistory;
