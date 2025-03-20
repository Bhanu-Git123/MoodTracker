import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const moods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "angry", emoji: "😠", label: "Angry" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "depressed", emoji: "😥", label: "Depressed" },
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

const MoodSelection = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodSuggestions, setMoodSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
    setMoodSuggestions([]); // Reset suggestions when selecting a new mood

    if (suggestions[moodId]) {
      const userWantsSuggestions = window.confirm(
        "Would you like some suggestions to improve your mood?"
      );
      if (userWantsSuggestions) {
        setMoodSuggestions(suggestions[moodId]);
      }
    }
  };

  const saveMood = () => {
    if (selectedMood && moodNote.trim()) {
      const moodEntry = { mood: selectedMood, note: moodNote };
      const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
      localStorage.setItem(
        "moodHistory",
        JSON.stringify([...moodHistory, moodEntry])
      );
      navigate("/mood-history");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-xl font-semibold text-black">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`p-4 border rounded-lg flex flex-col items-center text-black ${
              selectedMood === mood.id ? "border-purple-500 bg-purple-100" : ""
            }`}
            onClick={() => handleMoodSelection(mood.id)}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="mt-1 text-sm">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md bg-white text-black"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Write about your day..."
          />
          <button
            onClick={saveMood}
            className="mt-2 p-2 bg-purple-500 text-white rounded-md w-full"
          >
            Save Mood
          </button>
        </div>
      )}

      {moodSuggestions.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-white">
          <h3 className="text-lg font-medium text-black">
            Suggestions for You:
          </h3>
          <ul className="mt-2 list-disc list-inside text-black">
            {moodSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodSelection;
