import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./Karthikk/AuthPage";
import MoodSelection from "./Karthikk/MoodSelection";
import MoodHistory from "./Karthikk/MoodHistory";
import MoodAnalysis from "./Karthikk/MoodAnalysis";
import MoodReminder from "./Karthikk/MoodReminder";
import ThemeToggle from "./Karthikk/ThemeToggle";
import TopupPage from "./Karthikk/TopupPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/topup" element={<TopupPage />} />
          <Route path="/mood-selection" element={<MoodSelection />} />
          <Route path="/mood-history" element={<MoodHistory />} />
          <Route path="/mood-analysis" element={<MoodAnalysis />} />
          <Route path="/mood-reminder" element={<MoodReminder />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
