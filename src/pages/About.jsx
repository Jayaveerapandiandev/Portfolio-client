import React, { useEffect, useState, useMemo } from "react";
import { getAbout } from "../api/UserApi";
import { Loader2, Mail, MapPin, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const About = () => {
  const { theme, themeName } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAbout();
        if (res.success) setData(res.data);
      } catch {
        console.error("Failed to fetch About data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const borderColor = useMemo(() => {
    return themeName === "blackgold"
      ? "#facc15"
      : themeName === "forest"
      ? "#34d399"
      : themeName === "cyberpunk"
      ? "#22d3ee"
      : themeName === "lightblue"
      ? "#2563eb"
      : "#a855f7";
  }, [themeName]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-[60vh] ${theme.bg} ${theme.text}`}>
        <Loader2 className="animate-spin mr-2" /> Loading About...
      </div>
    );
  }

  if (!data) {
    return <p className={`text-center ${theme.text}`}>No about data available.</p>;
  }

  return (
    <section
      id="about"
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-16 ${theme.bg} ${theme.text}`}
    >
      <motion.div
        className="max-w-4xl w-full p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Image */}
        {data.profileImageUrl && (
          <motion.img
            src={`${data.profileImageUrl}?q_auto,f_auto`}
            alt="Profile"
            className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full mx-auto mb-6 border-4 shadow-2xl"
            style={{ borderColor }}
            whileHover={{ scale: 1.05 }}
          />
        )}

        {/* Bio */}
        <div className="mt-6 space-y-5 text-left leading-relaxed text-base md:text-lg opacity-90 px-2 md:px-8">
          {data.shortBio && (
            <p
              className="font-semibold border-l-4 pl-3 rounded-md"
              style={{ borderColor }}
            >
              {data.shortBio}
            </p>
          )}
          {data.description && (
            <p className="opacity-80 text-justify">{data.description}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-8 flex flex-col items-center gap-3 opacity-90">
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="flex items-center gap-2 hover:underline transition-all"
            >
              <Mail size={18} /> {data.email}
            </a>
          )}
          {data.location && (
            <p className="flex items-center gap-2">
              <MapPin size={18} /> {data.location}
            </p>
          )}
        </div>

        {/* Resume */}
        {data.resumeUrl && (
          <div className="flex flex-wrap gap-5 mt-10 justify-center">
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
            >
              <Eye size={18} /> View Resume
            </a>
            <a
              href={data.resumeUrl}
              download
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
            >
              <Download size={18} /> Download
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default About;
