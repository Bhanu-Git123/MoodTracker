import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const MoodAnalysis = () => {
  const chartRef = useRef(null);
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    setMoodHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (!chartRef.current || moodHistory.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(moodCounts),
        datasets: [
          {
            label: "Mood Frequency",
            data: Object.values(moodCounts),
            backgroundColor: "#805ad5",
            borderColor: "#6b46c1",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, [moodHistory]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold">Mood Analysis</h2>
      <canvas ref={chartRef} className="mt-4" />
    </div>
  );
};

export default MoodAnalysis;
