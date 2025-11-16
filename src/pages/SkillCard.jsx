// src/components/skills/SkillCard.jsx
import React, { memo } from "react";
import { Edit, Trash2 } from "lucide-react";

/**
 * Fully theme-consistent SkillCard
 */
const SkillCard = ({ skill, onEdit, onDelete, theme, themeName }) => {
  const {
    name,
    category,
    proficiency = 0,
    experienceYears,
    logoUrl,
    isHighlighted,
  } = skill;

  const progress = Math.max(0, Math.min(100, Number(proficiency || 0)));

  /* -------- THEME-BASED PROGRESS COLORS -------- */
  const progressGradient = {
    blackgold: "linear-gradient(90deg,#facc15,#b45309)",
    lightblue: "linear-gradient(90deg,#3b82f6,#06b6d4)",
    forest: "linear-gradient(90deg,#10b981,#065f46)",
    lavender: "linear-gradient(90deg,#a855f7,#6366f1)",
    cyberpunk: "linear-gradient(90deg,#ec4899,#22d3ee)",
  }[themeName];

  return (
    <div
      className={`rounded-2xl p-4 border ${theme.border} shadow-md flex flex-col justify-between ${theme.bg} ${theme.text}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-md overflow-hidden border">
          {/* Logo */}
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="max-w-full max-h-full object-contain bg-white p-1 rounded"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">{name}</h3>

            {/* Highlight Star follows theme.accent */}
            {isHighlighted && (
              <span className={`${theme.accent} text-xl`} title="Highlighted">
                ★
              </span>
            )}
          </div>

          <p className="text-sm opacity-80 mt-1">{category}</p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: progressGradient,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-1 opacity-70">
              <span>{progress}%</span>
              <span>
                {experienceYears
                  ? `${experienceYears} yr${experienceYears > 1 ? "s" : ""}`
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          onClick={onEdit}
          className={`px-3 py-1 rounded-md border ${theme.border} hover:opacity-90`}
        >
          <div className="flex items-center gap-2">
            <Edit size={16} />
            <span className="text-sm">Edit</span>
          </div>
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white"
        >
          <div className="flex items-center gap-2">
            <Trash2 size={16} />
            <span className="text-sm">Delete</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default memo(SkillCard);
