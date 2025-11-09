// src/pages/Main.jsx
import React from "react";
import Home from "./Home";
import About from "./About";
import Experience from "./Experience"; // ✅ new import
import Projects from "./Projects";
import Connect from "./Connect";
import { useTheme } from "../context/ThemeContext";

const Main = () => {
  const { theme } = useTheme();

  return (
    <main className={`overflow-x-hidden ${theme.bg} ${theme.text}`}>
      {/* 🏠 Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <Home />
      </section>

      {/* Divider */}
      <div
        className="w-full h-[2px] my-10 mx-auto opacity-30"
        style={{
          background: "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      ></div>

      {/* 👤 About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center">
        <About />
      </section>

      {/* Divider */}
      <div
        className="w-full h-[2px] my-10 mx-auto opacity-30"
        style={{
          background: "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      ></div>

      {/* 💼 Experience Section */}
      <section id="experience" className="min-h-screen flex items-center justify-center">
        <Experience />
      </section>

      {/* Divider */}
      <div
        className="w-full h-[2px] my-10 mx-auto opacity-30"
        style={{
          background: "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      ></div>

      {/* 💻 Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <Projects />
      </section>

      {/* Divider */}
      <div
        className="w-full h-[2px] my-10 mx-auto opacity-30"
        style={{
          background: "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      ></div>

      {/* ✉️ Connect Section */}
      <section id="connect" className="min-h-screen flex items-center justify-center">
        <Connect />
      </section>
    </main>
  );
};

export default Main;
