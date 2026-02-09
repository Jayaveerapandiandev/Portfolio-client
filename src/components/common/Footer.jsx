import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation once footer enters DOM
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <footer
      className={`
        w-full py-6 text-center border-t ${theme.border} ${theme.text}
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <p className="text-sm opacity-80">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Jayaveerapandian</span> — .NET Developer
      </p>
    </footer>
  );
};

export default Footer;
