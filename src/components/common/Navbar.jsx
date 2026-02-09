import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

import {
  Menu,
  X,
  User,
  ChevronDown,
  Home,
  UserCircle,
  Briefcase,
  FolderKanban,
  Sparkles,
  GraduationCap,
  Mail,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { to: "home", label: "Home", icon: <Home size={18} /> },
  { to: "about", label: "About", icon: <UserCircle size={18} /> },
  { to: "experience", label: "Experience", icon: <Briefcase size={18} /> },
  { to: "projects", label: "Projects", icon: <FolderKanban size={18} /> },
  { to: "skills", label: "Skills", icon: <Sparkles size={18} /> },
  { to: "education", label: "Education", icon: <GraduationCap size={18} /> },
  { to: "connect", label: "Connect", icon: <Mail size={18} /> },
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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`${theme.bg} fixed w-full z-50 top-0 left-0 ${theme.border} 
      border-b shadow-md transition-all duration-300 
      ${scrolled ? "py-1 backdrop-blur-md bg-opacity-80" : "py-3"}`}
    >
      <div
        className="
          max-w-6xl mx-auto 
          flex items-center 
          justify-start 
          gap-6 
          px-4 md:px-6
        "
      >
        {/* ⭐ LOGO — spaced from first section */}
        <RouterLink
          to="/"
          className={`
            ${scrolled ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}
            transition-all duration-300 
            text-xl md:text-2xl font-semibold 
            ${theme.accent} whitespace-nowrap 
            mr-12           /* FIXED: Name no longer touching Home */
          `}
        >
          Jayaveerapandian S
        </RouterLink>

        {/* ⭐ DESKTOP NAV */}
        <nav
          className="
            hidden md:flex items-center gap-4 
            relative 
            px-5 py-2 
            rounded-xl 
            bg-opacity-30 backdrop-blur-md 
            shadow-sm hover:shadow-md 
            transition-all
          "
        >
          {navLinks.map((link) => (
            <ScrollLink
              key={link.to}
              to={link.to}
              smooth={true}
              duration={600}
              offset={-80}
              spy={true}
              className={`
                cursor-pointer flex flex-col items-center justify-center
                px-3 py-1 transition duration-200 
                ${theme.text} hover:${theme.accent}
                relative
              `}
            >
              {/* ICON */}
              <span
                className="
                  transition-all duration-300 
                  hover:-translate-y-[2px] hover:scale-110
                "
              >
                {link.icon}
              </span>

              {/* LABEL (hidden when scrolled) */}
              {!scrolled && (
                <span className="text-[11px] mt-1 leading-none">
                  {link.label}
                </span>
              )}
            </ScrollLink>
          ))}

          {/* ADMIN */}
          <RouterLink
            to="/admin/login"
            className={`
              flex flex-col items-center px-3 py-1 
              ${theme.text} hover:${theme.accent} transition
            `}
          >
            <User size={18} className="transition-all hover:scale-110" />
            {!scrolled && <span className="text-[11px] mt-1">Admin</span>}
          </RouterLink>

          {/* THEME MENU */}
          {!scrolled && (
            <div
              className="relative ml-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`
                  flex items-center gap-1 px-3 py-2 rounded-md text-sm
                  ${theme.text} hover:${theme.accent} transition
                `}
              >
                Theme <ChevronDown size={16} />
              </button>

              {themeMenuOpen && (
                <div
                  className={`${theme.bg} absolute right-0 mt-2 w-40 rounded-md border ${theme.border} shadow-lg z-50`}
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
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ⭐ MOBILE */}
        <div className="md:hidden ml-auto flex items-center">
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

      {/* ⭐ MOBILE MENU */}
      {open && (
        <div className={`${theme.bg} border-t ${theme.border} shadow-md md:hidden`}>
          <nav className="px-4 py-4 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={600}
                offset={-80}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${theme.text} hover:${theme.accent}`}
              >
                {link.icon} {link.label}
              </ScrollLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
