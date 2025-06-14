import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TopupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/mood-selection");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-4">
      <h1 className="text-6xl md:text-7xl font-extrabold drop-shadow-lg mb-6 font-poppins uppercase tracking-wide">
        Hello Buddy! 👋
      </h1>
      <p className="text-3xl md:text-4xl font-semibold font-montserrat italic tracking-wider drop-shadow-md mb-10">
        Update Your Mood...
      </p>

      {/* Cycling emoji animation */}
      <div
        className="text-6xl animate-spin-slow"
        aria-label="Cycling animation"
      >
        🚴‍♂️
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,600&family=Poppins:wght@700&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease forwards;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Slow spin animation */
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TopupPage;
