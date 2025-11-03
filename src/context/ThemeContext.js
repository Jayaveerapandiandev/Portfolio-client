// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(
    localStorage.getItem("theme") || "blackgold"
  );

  useEffect(() => {
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  const value = {
    theme: themes[themeName],
    themeName,
    setThemeName,
  };

  return (
    // 👇 global background + text wrapper for the whole app
    <div
      className={`${themes[themeName].bg} ${themes[themeName].text} min-h-screen transition-colors duration-500`}
    >
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </div>
  );
};

export const useTheme = () => useContext(ThemeContext);
