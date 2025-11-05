import React, { useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { to: "home", label: "Home" },
  { to: "about", label: "About" },
  { to: "experience", label: "Experience" },
  { to: "projects", label: "Projects" },
  { to: "skills", label: "Skills" },
  { to: "connect", label: "Connect" },
];

const themesList = [
  { id: "blackgold", label: "Black Gold" },
  { id: "lightblue", label: "Light Blue" },
  { id: "forest", label: "Forest" },
  { id: "lavender", label: "Lavender" },
  { id: "cyberpunk", label: "Cyberpunk" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { themeName, setThemeName, theme } = useTheme();
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setThemeMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setThemeMenuOpen(false);
    }, 200);
  };

  return (
    <header
      className={`${theme.bg} fixed w-full z-50 top-0 left-0 ${theme.border} border-b shadow-md transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <RouterLink
          to="/"
          className={`text-xl md:text-2xl font-semibold ${theme.accent}`}
        >
          Jayaveerapandian S
        </RouterLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 relative">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.to}
              to={link.to}
              smooth={true}
              duration={600}
              offset={-80} // adjust based on navbar height
              spy={true}
              className={`cursor-pointer text-sm font-medium px-3 py-2 transition duration-200 ${theme.text} hover:${theme.accent}`}
              activeClass={theme.accent}
            >
              {link.label}
            </ScrollLink>
          ))}

          {/* Admin Link (Router navigation) */}
          <RouterLink
            to="/admin/login"
            className={`ml-3 inline-flex items-center gap-2 text-sm font-medium transition duration-200 ${theme.text} hover:${theme.accent}`}
          >
            <User size={18} />
            <span className="hidden sm:inline">Admin</span>
          </RouterLink>

          {/* 🌈 Theme Dropdown */}
          <div
            className="relative ml-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${theme.text} hover:${theme.accent} transition`}
            >
              Theme <ChevronDown size={16} />
            </button>

            {themeMenuOpen && (
              <div
                className={`${theme.bg} absolute right-0 mt-2 w-40 rounded-md border ${theme.border} shadow-lg z-50`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {themesList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeName(t.id);
                      setThemeMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      themeName === t.id
                        ? `${theme.accent} font-semibold`
                        : `${theme.text} hover:${theme.accent}`
                    } transition`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center">
          <RouterLink
            to="/admin/login"
            className={`${theme.text} hover:${theme.accent} transition mr-2`}
          >
            <User size={20} />
          </RouterLink>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={`p-2 rounded-md ${theme.text} hover:${theme.accent} transition`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          className={`${theme.bg} border-t ${theme.border} shadow-md md:hidden`}
        >
          <nav className="px-4 py-4 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={600}
                offset={-80}
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium px-3 py-2 transition duration-200 ${theme.text} hover:${theme.accent} cursor-pointer`}
              >
                {link.label}
              </ScrollLink>
            ))}

            <RouterLink
              to="/admin/login"
              onClick={() => setOpen(false)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition duration-200 ${theme.text} hover:${theme.accent}`}
            >
              <User size={18} /> Admin
            </RouterLink>

            {/* 🌈 Theme Dropdown (Mobile) */}
            <div className="pt-2">
              <select
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className={`w-full bg-transparent border ${theme.border} ${theme.text} text-sm px-3 py-2 rounded hover:${theme.accent} cursor-pointer transition`}
              >
                {themesList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
