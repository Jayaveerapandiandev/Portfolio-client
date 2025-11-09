import React, { useEffect, useState } from "react";
import { getHomeData } from "../api/UserApi";
import { ArrowRight, Linkedin, Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { themeName, theme } = useTheme();

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await getHomeData();
        if (res.success) setHomeData(res.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  if (loading) {
    return (
      <section
        className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}
      >
        <p className={`${theme.accent}`}>Loading...</p>
      </section>
    );
  }

  if (!homeData) {
    return (
      <section
        className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}
      >
        <p className="text-red-400">Failed to load home data.</p>
      </section>
    );
  }

  // 🌈 Define hover colors for each theme
  const themeHoverMap = {
    blackgold: "hover:bg-yellow-400 hover:text-black",
    lightblue: "hover:bg-blue-500 hover:text-white",
    forest: "hover:bg-emerald-500 hover:text-green-950",
    lavender: "hover:bg-purple-500 hover:text-white",
    cyberpunk: "hover:bg-cyan-400 hover:text-pink-600",
  };
  const hoverClass = themeHoverMap[themeName] || "hover:opacity-80";

  return (
    <section
      id="home"
      className={`min-h-screen flex flex-col justify-center items-center ${theme.bg} ${theme.text} px-6 pt-24 md:pt-28 transition-colors duration-500`}
    >
      <motion.div
        className="max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Name */}
        <h1 className={`text-4xl md:text-6xl font-bold ${theme.accent} mb-3`}>
          {homeData.name}
        </h1>

        {/* Role */}
        <h2 className="text-lg md:text-2xl opacity-80 mb-3">
          {homeData.role}
        </h2>

        {/* Tagline */}
        <p className="italic opacity-70 mb-6">{homeData.tagline}</p>

        {/* Intro */}
        <p className="opacity-80 leading-relaxed mb-8">{homeData.intro}</p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* If CTA1 is for projects → smooth scroll */}
          {homeData.cta1Link === "projects" ? (
            <ScrollLink
              to="projects"
              smooth={true}
              duration={600}
              offset={-70}
              className={`cursor-pointer border ${theme.accent} px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition duration-300 ${theme.accent.replace(
                "text-",
                "bg-"
              )} bg-opacity-20 ${hoverClass}`}
            >
              {homeData.cta1Text}
              <ArrowRight size={18} />
            </ScrollLink>
          ) : (
            <Link
              to={homeData.cta1Link}
              className={`border ${theme.accent} px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition duration-300 ${theme.accent.replace(
                "text-",
                "bg-"
              )} bg-opacity-20 ${hoverClass}`}
            >
              {homeData.cta1Text}
              <ArrowRight size={18} />
            </Link>
          )}

          {/* If CTA2 is for connect → smooth scroll */}
          {homeData.cta2Link === "connect" ? (
            <ScrollLink
              to="connect"
              smooth={true}
              duration={600}
              offset={-70}
              className={`cursor-pointer border ${theme.accent} px-6 py-3 rounded-lg font-medium transition duration-300 ${hoverClass}`}
            >
              {homeData.cta2Text}
            </ScrollLink>
          ) : (
            <Link
              to={homeData.cta2Link}
              className={`border ${theme.accent} px-6 py-3 rounded-lg font-medium transition duration-300 ${hoverClass}`}
            >
              {homeData.cta2Text}
            </Link>
          )}
        </div>

        {/* Social Icons */}
        <motion.div
          className="flex justify-center gap-6 mt-10 opacity-70 hover:opacity-100 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {homeData.linkedin && (
            <a
              href={homeData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:${theme.accent} transition`}
            >
              <Linkedin size={26} />
            </a>
          )}
          {homeData.github && (
            <a
              href={homeData.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:${theme.accent} transition`}
            >
              <Github size={26} />
            </a>
          )}
          {homeData.twitter && (
            <a
              href={homeData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:${theme.accent} transition`}
            >
              <Twitter size={26} />
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Home;
