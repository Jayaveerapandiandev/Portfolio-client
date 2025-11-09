import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateHomeData, getHomeData } from "../api/UserApi";
import { Loader2, Save } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // 🎨 Theme Context
import { Home } from "lucide-react";
import { motion } from "framer-motion";
const AdminHome = () => {
  const { themeName, theme } = useTheme(); // 🌗 get both name + colors
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tagline: "",
    intro: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    linkedin: "",
    github: "",
    twitter: "",
  });


  // === Fetch home data on mount ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomeData();
        if (response.success && response.data) {
          setFormData(response.data);
        } else {
          toast.error(response.message || "Failed to load home content.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching home data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === Handle input change ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // === Save Home Data ===
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateHomeData(formData);
      if (response.success) {
        toast.success("✅ Home content updated successfully!", {
          style: { background: "#111", color: theme.accentColor || "#FFD700" },
        });
      } else {
        toast.error(response.message || "Update failed.", {
          style: { background: "#111", color: "#f87171" },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update. Please try again.", {
        style: { background: "#111", color: "#f87171" },
      });
    } finally {
      setSaving(false);
    }
  };

  // === Dynamic input background per theme ===
  const inputTheme = {
    blackgold: "bg-gray-900 text-gray-100 border-gray-700 focus:border-yellow-400",
    forest: "bg-green-900 text-green-100 border-green-700 focus:border-emerald-400",
    cyberpunk: "bg-gray-900 text-pink-300 border-pink-700 focus:border-cyan-400",
    lightblue: "bg-white text-gray-800 border-blue-300 focus:border-blue-600",
    lavender: "bg-white text-gray-800 border-purple-300 focus:border-purple-600",
  }[themeName];

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme.bg} ${theme.text}`}>
        <Loader2 className="animate-spin mr-2" /> Loading Home Data...
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />

      {/* LEFT — Editor */}
      <div className={`lg:w-1/2 w-full p-8 border-r ${theme.border}`}>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-3 text-2xl sm:text-3xl font-extrabold mb-6 ${theme.text}`}
        >
          <Home className={`${theme.accent.replace("text-", "text-")} w-7 h-7`} />
          <span className={`${theme.accent}`}>Edit Home Content</span>
        </motion.h2>

        <div className="space-y-4">
          {[
            { label: "Name", name: "name" },
            { label: "Role / Title", name: "role" },
            { label: "Tagline", name: "tagline" },
            { label: "Brief Intro", name: "intro" },
            { label: "CTA 1 Text", name: "cta1Text" },
            { label: "CTA 1 Link", name: "cta1Link" },
            { label: "CTA 2 Text", name: "cta2Text" },
            { label: "CTA 2 Link", name: "cta2Link" },
            { label: "LinkedIn URL", name: "linkedin" },
            { label: "GitHub URL", name: "github" },
            { label: "Twitter URL", name: "twitter" },
          ].map((input) => (
            <div key={input.name}>
              <label className="block text-sm opacity-80 mb-1">
                {input.label}
              </label>
              <input
                type="text"
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md outline-none transition-all duration-200 ${inputTheme}`}
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${theme.btn}`}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT — Live Preview */}
      <div className={`lg:w-1/2 w-full p-10 flex flex-col justify-center items-center text-center ${theme.bg}`}>
        <div className="max-w-xl">
          <h1 className={`text-4xl font-bold ${theme.accent} mb-2`}>
            {formData.name || "Your Name"}
          </h1>
          <h2 className="text-xl opacity-90 mb-4">
            {formData.role || "Your Role / Title"}
          </h2>
          <p className="italic opacity-75 mb-4">
            “{formData.tagline || "Your tagline goes here"}”
          </p>
          <p className="opacity-90 mb-6">
            {formData.intro || "Your short introduction."}
          </p>

          {/* Preview Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-md font-semibold cursor-not-allowed opacity-80 border ${theme.accent}`}
              disabled
            >
              {formData.cta1Text || "View Projects"}
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold cursor-not-allowed opacity-80 border ${theme.accent}`}
              disabled
            >
              {formData.cta2Text || "Contact Me"}
            </button>
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-6 mt-6 opacity-80 text-sm">
            {formData.linkedin && <span>LinkedIn 🔗</span>}
            {formData.github && <span>GitHub 💻</span>}
            {formData.twitter && <span>Twitter 🐦</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
