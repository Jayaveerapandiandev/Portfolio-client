import React from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Mail, Eye, Download } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const About = () => {
  const { data, loading } = usePortfolioData();
  const { theme, themeName } = useTheme();

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!data) return <div className="text-center p-10 text-red-500">Failed to load data.</div>;

  const about = data.aboutSection || {};
  
  return (
    <div
      className={`lg:w-1/2 w-full flex justify-center items-center p-10 border-l ${theme.border} ${theme.bg} ${theme.text}`}
    >
      <div className="w-full max-w-2xl text-center space-y-8 bg-opacity-10 p-8 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Profile Image */}
        {about.profileImageUrl ? (
          <div className="relative flex justify-center">
            <img
              src={about.profileImageUrl}
              alt="Profile"
              className="w-44 h-44 md:w-52 md:h-52 object-cover rounded-full shadow-xl border-4 border-opacity-80 transition-transform duration-700 hover:scale-105"
              style={{
                borderColor:
                  themeName === "blackgold"
                    ? "#facc15"
                    : themeName === "forest"
                    ? "#34d399"
                    : themeName === "cyberpunk"
                    ? "#22d3ee"
                    : themeName === "lightblue"
                    ? "#2563eb"
                    : "#a855f7",
              }}
            />
          </div>
        ) : (
          <div className="w-44 h-44 md:w-52 md:h-52 bg-gray-700 rounded-full flex items-center justify-center text-sm">
            No Image
          </div>
        )}

        {/* Info */}
        <div className="space-y-2">
          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-wide ${theme.accent}`}>
            {about.fullName || "Your Name"}
          </h1>
          <p className="text-lg italic font-medium opacity-80">
            {about.role || "Your Role / Title"}
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-4 text-left leading-relaxed text-base md:text-lg opacity-90 px-3 md:px-6">
          {about.shortBio && (
            <p
              className="font-semibold text-lg opacity-95 border-l-4 pl-3 rounded-md border-opacity-60"
              style={{
                borderColor:
                  themeName === "blackgold"
                    ? "#facc15"
                    : themeName === "forest"
                    ? "#34d399"
                    : themeName === "cyberpunk"
                    ? "#22d3ee"
                    : themeName === "lightblue"
                    ? "#2563eb"
                    : "#a855f7",
              }}
            >
              {about.shortBio}
            </p>
          )}
          {about.description && (
            <p className="opacity-80 text-justify tracking-wide leading-relaxed">
              {about.description}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-6 flex flex-col gap-3 justify-center items-center text-sm md:text-base opacity-90">
          <a
            href={`mailto:${about.email}`}
            className="flex items-center gap-2 hover:underline hover:opacity-100 transition-all"
          >
            <Mail size={18} />
            {about.email || "youremail@example.com"}
          </a>

          {about.location && (
            <p className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.418 0 8-3.582 8-8a8 8 0 10-16 0c0 4.418 3.582 8 8 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v.01" />
              </svg>
              {about.location}
            </p>
          )}
        </div>

        {/* Resume Buttons */}
        {about.resumeUrl && (
          <div className="flex flex-wrap gap-5 mt-8 justify-center">
            <a
              href={about.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
            >
              <Eye size={18} /> View Resume
            </a>
            <a
              href={about.resumeUrl}
              download
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
            >
              <Download size={18} /> Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
