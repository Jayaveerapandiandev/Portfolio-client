import React from "react";
import { useNavigate } from "react-router-dom";
import { Hammer, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // ✅ import global theme context

const WorkInProgress = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ get current theme values

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${theme.bg} ${theme.text} text-center px-4`}
    >
      {/* Animated Icon */}
      <Hammer
        size={60}
        className={`${theme.accent} mb-4 animate-bounce drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
      />

      {/* Title */}
      <h1 className={`text-3xl font-bold ${theme.accent} mb-2`}>
        Work In Progress 🚧
      </h1>

      {/* Description */}
      <p className="text-gray-400 max-w-md mb-8">
        This section is currently under development and will be available in a
        future update. Stay tuned for exciting new features!
      </p>

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition ${theme.btn}`}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
    </div>
  );
};

export default WorkInProgress;
