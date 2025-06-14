import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const moods = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    color: "bg-yellow-200",
    border: "border-yellow-400",
    hover: "hover:bg-yellow-300",
  },
  {
    id: "excited",
    emoji: "🤩",
    label: "Excited",
    color: "bg-pink-200",
    border: "border-pink-400",
    hover: "hover:bg-pink-300",
  },
  {
    id: "neutral",
    emoji: "😐",
    label: "Neutral",
    color: "bg-gray-200",
    border: "border-gray-400",
    hover: "hover:bg-gray-300",
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    color: "bg-blue-200",
    border: "border-blue-400",
    hover: "hover:bg-blue-300",
  },
  {
    id: "angry",
    emoji: "😠",
    label: "Angry",
    color: "bg-red-200",
    border: "border-red-400",
    hover: "hover:bg-red-300",
  },
  {
    id: "tired",
    emoji: "😴",
    label: "Tired",
    color: "bg-purple-200",
    border: "border-purple-400",
    hover: "hover:bg-purple-300",
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Anxious",
    color: "bg-indigo-200",
    border: "border-indigo-400",
    hover: "hover:bg-indigo-300",
  },
  {
    id: "depressed",
    emoji: "😥",
    label: "Depressed",
    color: "bg-teal-200",
    border: "border-teal-400",
    hover: "hover:bg-teal-300",
  },
];

const suggestions = {
  sad: [
    "Take a short walk outside to refresh your mind.",
    "Listen to your favorite music or a relaxing song.",
    "Talk to a close friend or family member about your feelings.",
  ],
  angry: [
    "Take deep breaths and count to 10 before reacting.",
    "Engage in a physical activity like running or boxing.",
    "Write down your thoughts to release frustration.",
  ],
  tired: [
    "Take a power nap for 20 minutes to regain energy.",
    "Drink a glass of water to stay hydrated.",
    "Do some light stretching to feel more awake.",
  ],
  anxious: [
    "Practice deep breathing exercises for relaxation.",
    "Write down your worries and rationalize them.",
    "Try a short meditation or mindfulness session.",
  ],
  depressed: [
    "Reach out to someone you trust and talk about your feelings.",
    "Do something creative like drawing or journaling.",
    "Take small steps to complete a task and build momentum.",
  ],
};

const MoodSuggestionsModal = ({ suggestions, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Suggestions for You
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {suggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
      <button
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const MoodSelection = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodSuggestions, setMoodSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
    if (suggestions[moodId]) {
      setMoodSuggestions(suggestions[moodId]);
      setShowModal(true);
    }
  };

  const saveMood = () => {
    const email = localStorage.getItem("loggedInUser");
    if (!email) {
      alert("User not logged in.");
      return;
    }

    if (selectedMood && moodNote.trim()) {
      const moodEntry = { email, mood: selectedMood, note: moodNote };
      const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
      localStorage.setItem(
        "moodHistory",
        JSON.stringify([...moodHistory, moodEntry])
      );
      alert("Mood saved successfully!");
      setSelectedMood(null);
      setMoodNote("");
    } else {
      alert("Please select a mood and write a note.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/register"); // or "/login"
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          How are you feeling today?
        </h2>
        <div className="space-x-3">
          <button
            onClick={() => navigate("/mood-history")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            View Mood History
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`p-6 border rounded-lg flex flex-col items-center text-gray-900 shadow-md
              transition transform hover:scale-105 focus:outline-none 
              ${mood.color} ${mood.border} ${mood.hover} 
              ${
                selectedMood === mood.id
                  ? "ring-4 ring-offset-2 ring-purple-500"
                  : ""
              }`}
            onClick={() => handleMoodSelection(mood.id)}
          >
            <span className="text-5xl">{mood.emoji}</span>
            <span className="mt-2 text-lg font-semibold">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mt-10 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <textarea
            maxLength={300}
            className="w-full p-3 border rounded-md bg-gray-50 text-gray-900 resize-none focus:ring-2 focus:ring-purple-600"
            rows={5}
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Write about your day..."
          />
          <p className="text-sm text-gray-600 mt-1 text-right">
            {moodNote.length} / 300 characters
          </p>
          <button
            onClick={saveMood}
            className="mt-5 w-full p-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
          >
            Save Mood
          </button>
        </div>
      )}

      {showModal && (
        <MoodSuggestionsModal
          suggestions={moodSuggestions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MoodSelection;
