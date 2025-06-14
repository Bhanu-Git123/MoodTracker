import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const MoodAnalysis = () => {
  const chartRef = useRef(null);
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    const storedHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const filteredHistory = storedHistory.filter(
      (entry) => entry.email === email
    );
    setMoodHistory(filteredHistory);
  }, []);

  useEffect(() => {
    if (!chartRef.current || moodHistory.length === 0) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy existing chart instance
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    // Count mood occurrences
    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const moodColors = {
      happy: "#fcd34d",
      excited: "#f472b6",
      neutral: "#d1d5db",
      sad: "#60a5fa",
      angry: "#f87171",
      tired: "#a78bfa",
      anxious: "#818cf8",
      depressed: "#5eead4",
    };

    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts);
    const backgroundColors = labels.map((mood) => moodColors[mood] || "#ccc");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Mood Frequency",
            data,
            backgroundColor: backgroundColors,
            borderColor: "#4c1d95",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#4b5563",
            },
          },
          x: {
            ticks: {
              color: "#4b5563",
            },
          },
        },
      },
    });
  }, [moodHistory]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-violet-100 to-indigo-100 text-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Mood Frequency Analysis
      </h2>
      {moodHistory.length === 0 ? (
        <p className="text-center text-gray-700 text-lg mt-10">
          No mood data available to analyze.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <canvas ref={chartRef} />
        </div>
      )}
    </div>
  );
};

export default MoodAnalysis;
