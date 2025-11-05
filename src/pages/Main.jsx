// src/pages/Main.jsx
import React from "react";
import Home from "./Home";
import About from "./About";
import { useTheme } from "../context/ThemeContext";

const Main = () => {
  const { theme } = useTheme();

  return (
    <main className={`overflow-x-hidden ${theme.bg} ${theme.text}`}>
      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <Home />
      </section>

      {/* Subtle Divider / Transition */}
      <div
        className="w-full h-[2px] my-10 mx-auto opacity-30"
        style={{
          background: "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      ></div>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center"
      >
        <About />
      </section>
    </main>
  );
};

export default Main;
