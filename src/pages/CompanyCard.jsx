import React from "react";
import { useTheme } from "../context/ThemeContext";

const CompanyCard = ({
  company,
  onAddPosition,
  onDelete,
  onDeletePosition, // 🆕 new prop
  children,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`border ${theme.border} rounded-2xl p-5 shadow-md mb-8 transition-colors duration-300 
                  ${theme.bg} ${theme.text}`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              className="h-12 w-12 rounded-lg object-cover shadow"
            />
          )}
          <div>
            <h2 className={`font-semibold text-lg ${theme.accent}`}>
              {company.name}
            </h2>
            <p className="text-sm opacity-70">{company.location}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAddPosition}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${theme.btn}`}
          >
            + Add Position
          </button>
          <button
            onClick={onDelete}
            className={`px-3 py-1 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700`}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Experience List */}
      <div className="mt-4">
        {company.experiences && company.experiences.length > 0 ? (
          company.experiences.map((exp) => (
            <div
              key={exp.id}
              className={`border-l-4 ${theme.border} pl-3 mb-3 flex justify-between items-center`}
            >
              <div>
                <p className={`font-medium ${theme.accent}`}>
                  {exp.designation}
                </p>
                <p className="text-sm opacity-80">{exp.positionTitle}</p>
                <p className="text-xs opacity-60">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
              </div>

              {/* 🗑️ Delete position button */}
              <button
                onClick={() => onDeletePosition(exp.id)}
                className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm opacity-50 italic">No positions added yet</p>
        )}
      </div>

      {/* Add Position Form (child) */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default CompanyCard;
