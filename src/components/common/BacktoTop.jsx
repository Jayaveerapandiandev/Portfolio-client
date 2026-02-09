import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const BackToTop = () => {
  const [show, setShow] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`
        fixed bottom-20 right-6 z-50 p-3 rounded-full shadow-lg
        transition-all duration-300
        ${theme.bg} ${theme.text} border ${theme.border}
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
