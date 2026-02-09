import React, { useEffect, useState } from "react";
import { getEducation } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";
import {
  GraduationCap,
  MapPin,
  Clock,
  Award,
  ChevronDown,
} from "lucide-react";

const Education = () => {
  const { theme } = useTheme();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const res = await getEducation();
        if (res?.success) {
          const visible = (res.data || [])
            .filter((e) => e.isVisible)
            .sort((a, b) => a.order - b.order);
          setEducationList(visible);
        }
      } catch (error) {
        console.error("Failed to load education", error);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatScore = (value) => {
    if (!value) return null;

    if (value.toLowerCase().includes("cgpa"))
      return value;

    if (value.includes("%"))
      return `Percentage: ${value}`;

    return `Score: ${value}`;
  };

  const calculateDuration = (startYear, endYear) =>
    endYear ? `${endYear - startYear} yrs` : "Ongoing";

  if (loading)
    return (
      <div className={`p-6 text-center opacity-70 ${theme.text}`}>
        Loading education...
      </div>
    );

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${theme.bg} ${theme.text}`}>
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-2 sm:gap-3 ${theme.accent}`}
        >
          <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9" />
          Education
        </h1>
        <p className={`text-sm mt-2 italic opacity-80 ${theme.accent}`}>
          "Learning is a lifelong journey 📚"
        </p>
      </div>

      {/* Cards Container - No Timeline */}
      <div className="max-w-7xl mx-auto">
        <div className="relative pl-0 sm:pl-6 md:pl-8">
          {/* Timeline Line - Left Side Only */}
          <div className="hidden sm:block absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"></div>

          {educationList.map((edu, index) => (
            <div key={edu.id} className="mb-6 md:mb-8 relative">
              {/* Card - Matching Experience Design */}
              <div
                onClick={() => toggleExpand(edu.id)}
                className={`
                  p-5 sm:p-6 rounded-lg sm:rounded-xl 
                  shadow-md border ${theme.border} ${theme.cardBg}
                  hover:shadow-xl transition-all duration-300 cursor-pointer
                  transform hover:-translate-y-1
                `}
              >
                {/* Main Content Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  
                  {/* Left Section - Logo & Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Logo */}
                    {edu.instituteLogo?.url && (
                      <div className="flex-shrink-0">
                        <img
                          src={edu.instituteLogo.url}
                          alt={edu.instituteName}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-white p-1"
                        />
                      </div>
                    )}
                    
                    {/* Text Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className={`text-lg sm:text-xl font-bold ${theme.accent} leading-tight mb-1`}>
                        {edu.educationType}
                      </h2>
                      <p className="text-sm sm:text-base font-medium opacity-90">
                        {edu.instituteName}
                      </p>
                      {edu.department && (
                        <p className="text-xs sm:text-sm opacity-70 mt-1">
                          {edu.department}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm opacity-60 mt-2">
                        {edu.startYear} - {edu.endYear}
                      </p>
                    </div>
                  </div>

                  {/* Right Section - Score & Duration */}
                  <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-70">
                      <Clock className={`w-4 h-4 ${theme.accent}`} />
                      <span>{calculateDuration(edu.startYear, edu.endYear)}</span>
                    </div>

                    {/* Score */}
                    {edu.percentage && (
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Award className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.accent}`} />
                        <span className="font-semibold opacity-90">
                          {formatScore(edu.percentage)}
                        </span>
                      </div>
                    )}

                    {/* Expand Icon */}
                    <div className="mt-1">
                      <ChevronDown 
                        className={`w-5 h-5 ${theme.accent} transition-transform duration-300 ${
                          expanded[edu.id] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expanded[edu.id] ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Description */}
                        {edu.description && (
                          <div>
                            <h3 className={`font-semibold text-sm sm:text-base mb-2 ${theme.accent}`}>
                              About
                            </h3>
                            <p className="text-xs sm:text-sm whitespace-pre-line opacity-85 leading-relaxed">
                              {edu.description}
                            </p>
                          </div>
                        )}

                        {/* Location */}
                        {edu.location && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm opacity-75">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Highlights */}
                      {edu.highlights?.length > 0 && (
                        <div>
                          <h3 className={`font-semibold text-sm sm:text-base mb-2 ${theme.accent}`}>
                            Highlights
                          </h3>
                          <ul className="space-y-2">
                            {edu.highlights.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${theme.accent} bg-current mt-1.5 flex-shrink-0`}></span>
                                <span className="opacity-85 leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;