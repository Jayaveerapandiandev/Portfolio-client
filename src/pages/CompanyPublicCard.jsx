import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Link2, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// ✅ Normalize URL to include https
const normalizeUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

// ✅ Parse dd-MM-yyyy or yyyy-MM-dd
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    } else if (parts[0].length === 4) {
      const [year, month, day] = parts;
      return new Date(`${year}-${month}-${day}`);
    }
  }
  return new Date(dateStr);
};

// ✅ Format date to "Jan 2023"
const formatDate = (dateStr) => {
  const date = parseDate(dateStr);
  if (!date || isNaN(date)) return null;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

// ✅ Calculate duration between two dates
const calculateDuration = (start, end) => {
  const startDate = parseDate(start);
  const endDate = end ? parseDate(end) : new Date();
  if (!startDate || isNaN(startDate)) return "";

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (totalMonths <= 0) return "Less than a month";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months} mo${months > 1 ? "s" : ""}`;
  if (months === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`;
};

// ✅ Get total duration across all company experiences
const getCompanyExperienceDuration = (experiences) => {
  if (!experiences?.length) return "";
  const sorted = [...experiences].sort(
    (a, b) => parseDate(a.startDate) - parseDate(b.startDate)
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return calculateDuration(first.startDate, last.endDate);
};

// ✅ Extract technologies safely
const parseTechnologies = (exp) => {
  if (!exp) return [];
  if (Array.isArray(exp.technologies)) return exp.technologies;
  if (Array.isArray(exp.technologiesUsed)) return exp.technologiesUsed;
  if (typeof exp.technologiesUsed === "string" && exp.technologiesUsed.trim()) {
    return exp.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

const CompanyPublicCard = ({ company }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const totalDuration = getCompanyExperienceDuration(company.experiences);
  const sortedExperiences = [...(company.experiences || [])].sort(
    (a, b) => parseDate(a.startDate) - parseDate(b.startDate)
  );
  const mainExp = sortedExperiences[sortedExperiences.length - 1]; // latest role

  return (
    <motion.div
      layout
      className={`relative border ${theme.border} rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg ${theme.bg} ${theme.text}`}
      onClick={() => setExpanded((s) => !s)}
    >
      {/* 🏢 Top Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Company Logo */}
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="h-12 w-12 rounded-lg object-cover border"
            />
          ) : (
            <div
              className={`h-12 w-12 rounded-lg flex items-center justify-center ${theme.border}`}
            >
              <span className="text-sm opacity-60">🏢</span>
            </div>
          )}

          {/* Company Name + Role */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.accent}`}>
              {company.name}
            </h3>
            {mainExp && (
              <>
                <p className="text-sm opacity-80">{mainExp.designation}</p>
                {mainExp.startDate && (
                  <p className="text-xs opacity-60 italic">
                    Since {formatDate(mainExp.startDate)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* 🔹 Right Side: Total Duration, Website, Toggle */}
        <div className="flex items-center gap-3 flex-wrap justify-end text-sm">
          {totalDuration && (
            <span className="flex items-center opacity-75 italic whitespace-nowrap">
              <Clock className="w-4 h-4 mr-1 opacity-70" />
              Total: {totalDuration}
            </span>
          )}

          {company.website && (
            <a
              href={normalizeUrl(company.website)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${theme.border} ${theme.accent} text-xs font-medium hover:opacity-80 transition`}
            >
              <Link2 className="w-4 h-4" />
              Website
            </a>
          )}

          {expanded ? (
            <ChevronUp className={`${theme.accent} w-5 h-5`} />
          ) : (
            <ChevronDown className={`${theme.accent} w-5 h-5`} />
          )}
        </div>
      </div>

      {/* 📅 Experience Timeline */}
      {sortedExperiences.length > 0 && (
        <div className="mt-5 border-l-2 border-dashed pl-5 ml-2">
          {sortedExperiences.map((exp) => {
            const start = formatDate(exp.startDate);
            const end = formatDate(exp.endDate) || "Present";
            return (
              <div key={exp.id} className="mb-3 relative">
                <div
                  className={`absolute -left-[11px] top-[6px] w-2 h-2 rounded-full ${theme.accent}`}
                ></div>
                {/* Removed duplicate designation line */}
                <p className="text-sm opacity-80">{exp.positionTitle}</p>
                <p className="text-xs opacity-70 mt-1 italic">
                  {start} — {end}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔽 Expanded Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-4 pt-4 border-t"
          >
            {sortedExperiences.map((exp) => {
              const techs = parseTechnologies(exp);
              return (
                <div key={exp.id} className="mb-6">
                  {exp.description && (
                    <>
                      <h4 className={`font-semibold mb-2 ${theme.accent}`}>
                        About the role
                      </h4>
                      <p className="text-sm leading-relaxed opacity-90 mb-3">
                        {exp.description}
                      </p>
                    </>
                  )}

                  {techs.length > 0 && (
                    <>
                      <h4 className={`font-semibold mb-2 ${theme.accent}`}>
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${theme.border}`}
                          >
                            <span className={`${theme.accent}`}>{t}</span>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompanyPublicCard;
