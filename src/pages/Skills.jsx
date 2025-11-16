// src/pages/Skills.jsx
import React, { useEffect, useState } from "react";
import { getSkills } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";
import { Star } from "lucide-react";

const Skills = () => {
  const { theme, themeName } = useTheme();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSkills();
        if (res?.success) {
          const list = res.data || [];
          const cats = Array.from(new Set(list.map((s) => s.category))).sort();
          setCategories(["All", ...cats]);
          setSkills(list);
        }
      } catch (error) {
        console.error("Failed to load skills", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const groupedByCategory = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading)
    return (
      <div className={`p-6 text-center opacity-70 ${theme.text}`}>
        Loading skills...
      </div>
    );

  return (
    <div className={`p-6 min-h-screen ${theme.bg} ${theme.text}`}>
      {/* 🛠 Themed Heading with icon */}
      <div className="text-center mb-14">
        <h1
          className={`text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3 ${theme.accent}`}
        >
          <Star className="w-9 h-9 animate-pulse" />
          My Skills
        </h1>
        <p className={`text-sm mt-2 italic ${theme.accent}`}>
          “Sharpening tools and building magic, one skill at a time ✨”
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium 
              ${
                activeCategory === cat
                  ? theme.btn
                  : `border ${theme.border} ${
                      themeName === "blackgold" || themeName === "forest"
                        ? "text-gray-100"
                        : "text-gray-800"
                    } hover:${theme.btn}`
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center opacity-60">No skills in this category.</div>
      ) : (
        Object.keys(groupedByCategory).map((category) => (
          <div key={category} className="mb-12">
            <h3
              className={`text-2xl font-semibold mb-4 border-b pb-1 ${theme.accent}`}
            >
              {category}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedByCategory[category]
                .sort(
                  (a, b) =>
                    b.isHighlighted - a.isHighlighted ||
                    a.name.localeCompare(b.name)
                )
                .map((skill) => (
                  <div
                    key={skill.id}
                    className={`p-4 rounded-xl shadow-md border 
                      hover:shadow-lg hover:-translate-y-1 transition-all duration-200
                      ${theme.cardBg || ""}`}
                  >
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                      {skill.logoUrl && (
                        <img
                          src={skill.logoUrl}
                          alt={skill.name}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <div>
                        <h4 className="text-lg font-semibold">{skill.name}</h4>
                        <p className="text-sm opacity-80">
                          {skill.experienceYears} yr
                          {skill.experienceYears > 1 ? "s" : ""} experience
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm opacity-80 mb-1">
                        <span>Proficiency</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${skill.proficiency}%` }}
                          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                        ></div>
                      </div>
                    </div>

                    {skill.isHighlighted && (
                      <div
                        className="mt-3 inline-block px-2 py-1 text-xs rounded-md 
                        bg-yellow-500 text-black font-semibold"
                      >
                        ⭐ Highlighted
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Skills;
