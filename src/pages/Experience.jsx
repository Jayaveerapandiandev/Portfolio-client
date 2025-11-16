// src/pages/Experience.jsx
import React, { useEffect, useState } from "react";
import { getCompanies } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";
import { Star, Clock } from "lucide-react";

const Experience = () => {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCompanies();
        if (res?.success) setCompanies(res.dataList || []);
      } catch (error) {
        console.error("Failed to load experiences", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleExpand = (expId) => {
    setExpanded((prev) => ({ ...prev, [expId]: !prev[expId] }));
  };

  const calculateTotalExperience = (experiences) => {
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const [dayS, monthS, yearS] = exp.startDate.split("-");
      const start = new Date(`${yearS}-${monthS}-${dayS}`);
      const end = exp.isCurrentCompany
        ? new Date()
        : new Date(exp.endDate?.split("-").reverse().join("-"));
      totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years > 0 ? years + " yr " : ""}${months} mo`;
  };

  if (loading)
    return (
      <div className={`p-6 text-center opacity-70 ${theme.text}`}>
        Loading experiences...
      </div>
    );

  return (
    <div className={`p-6 min-h-screen ${theme.bg} ${theme.text}`}>
      {/* Header */}
      <div className="text-center mb-14">
        <h1
          className={`text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3 ${theme.accent}`}
        >
          <Star className="w-9 h-9 animate-pulse" />
          My Experiences
        </h1>
        <p className={`text-sm mt-2 italic ${theme.accent}`}>
          “Building my journey, one role at a time ✨”
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-12">
        {/* Vertical timeline line on the left */}
        <div className="absolute top-0 left-6 w-1 h-full bg-gray-300 dark:bg-gray-700"></div>

        {companies.map((company) =>
          company.experiences.map((exp) => (
            <div key={exp.id} className="mb-10 relative">
              {/* Card */}
              <div
                onClick={() => toggleExpand(exp.id)}
                className={`p-6 rounded-xl shadow-md border ${theme.border} ${theme.cardBg} hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {company.logoUrl && (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-14 h-14 object-contain rounded"
                      />
                    )}
                    <div>
                      <h2 className={`text-lg font-bold ${theme.accent}`}>
                        {company.name}
                      </h2>
                       <p className={`text-sm opacity-80 ${theme.text} whitespace-normal break-words`}>
                          {exp.designation}
                        </p>
                        <p className={`text-sm opacity-80 ${theme.text}`}>
                        {exp.positionTitle}
                      </p>
                      <p className={`text-xs mt-1 opacity-70 ${theme.text}`}>
                        {exp.startDate} - {exp.isCurrentCompany ? "Present" : exp.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Total experience + website */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Clock className={`w-5 h-5 ${theme.accent}`} />
                      <span className={`${theme.text}`}>
                        {calculateTotalExperience(company.experiences)}
                      </span>
                    </div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${theme.btn}`}
                    >
                      View Website
                    </a>
                  </div>
                </div>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    expanded[exp.id] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className={`font-semibold mb-1 ${theme.accent}`}>About the Role</h3>
                      <p className={`text-sm whitespace-pre-line ${theme.text}`}>
                        {exp.description}
                      </p>
                    </div>

                    <div>
                      <h3 className={`font-semibold mb-1 ${theme.accent}`}>Technologies Used</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {exp.technologiesUsed.split(",").map((tech) => (
                          <span
                            key={tech.trim()}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                              ${theme.text} border-${theme.accent.replace(
                              "text-",
                              ""
                            )} hover:bg-${theme.accent.replace("text-", "")} hover:text-black`}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Experience;
