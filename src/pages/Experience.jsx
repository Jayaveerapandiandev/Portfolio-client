import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { getCompanies } from "../api/UserApi";
import CompanyPublicCard from "./CompanyPublicCard";
import { Briefcase } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Experience = () => {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const timelineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const loadExperiences = async () => {
      setLoading(true);
      try {
        const res = await getCompanies();
        if (res?.success) {
          setCompanies(res.dataList || []);
        }
      } catch (err) {
        console.error("Error loading experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`min-h-screen py-16 px-6 md:px-20 transition-colors duration-300 ${theme.bg} ${theme.text}`}
    >
      <div className="max-w-4xl mx-auto relative">

        {/* 🧠 Animated Header */}
        <div className="text-center mb-14">
          <h1
            className={`text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3 ${theme.accent}`}
          >
            <Briefcase className="w-9 h-9 animate-pulse" />
            Work Experience
          </h1>
          <p
            className={`text-sm mt-2 italic ${theme.accent}`}
            
          >
            “Turning bugs into features since forever 🐞➡️✨”
          </p>

        </div>

        {/* 🔄 Loading */}
        {loading ? (
          <p className="text-center opacity-70">Loading experiences...</p>
        ) : companies.length === 0 ? (
          // 🌱 Elegant Placeholder
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="relative">
              <Briefcase
                className={`w-16 h-16 mb-4 ${theme.accent} animate-bounce`}
              />
              <span
                className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full animate-pulse"
              />
            </div>
            <h2 className={`text-xl font-semibold ${theme.accent}`}>
              Every journey starts with a blank page.
            </h2>
            <p className={`text-sm mt-2 opacity-70 ${theme.text}`}>
              Experiences coming soon...
            </p>
          </div>
        ) : (
          // 🕓 Timeline with Company Cards
          <div className="relative pl-6 space-y-10">
            <motion.div
              style={{ scaleY: timelineScale }}
              className={`absolute left-4 top-0 bottom-0 w-[2px] origin-top ${theme.accent}`}
              initial={{ scaleY: 0 }}
            >
              <div
                style={{
                  width: "2px",
                  height: "100%",
                  boxShadow: "0 0 14px currentColor, 0 0 30px currentColor",
                }}
                className="w-[2px] h-full"
              />
            </motion.div>

            {companies.map((company) => (
              <div key={company.id} className="relative">
                <div
                  className={`absolute left-1 top-6 w-4 h-4 rounded-full ${theme.accent} shadow-md`}
                  style={{ boxShadow: "0 0 8px currentColor" }}
                />
                <CompanyPublicCard company={company} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
