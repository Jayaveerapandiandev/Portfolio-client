// src/pages/Main.jsx
import React from "react";
import Home from "./Home";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills"; // ✅ Import Skills
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
      <Divider />

      {/* 👤 About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center">
        <About />
      </section>

      <Divider />

      {/* 💼 Experience Section */}
      <section id="experience" className="min-h-screen flex items-center justify-center">
        <Experience />
      </section>

      <Divider />

      {/* 💻 Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <Projects />
      </section>

      <Divider />

      {/* 🛠️ Skills Section */}
      <section id="skills" className="min-h-screen flex items-center justify-center">
        <Skills />
      </section>

      <Divider />

      {/* ✉️ Connect Section */}
      <section id="connect" className="min-h-screen flex items-center justify-center">
        <Connect />
      </section>

    </main>
  );
};

// Reusable Divider Component
const Divider = () => (
  <div
    className="w-full h-[2px] my-10 mx-auto opacity-30"
    style={{
      background: "linear-gradient(to right, transparent, currentColor, transparent)",
    }}
  ></div>
);

export default Main;
