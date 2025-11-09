// src/pages/Projects.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getProjects } from "../api/UserApi";
import ProjectModal from "./ProjectModal";

const Projects = () => {
  const { themeName, theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

 const fetchProjects = useCallback(async () => {
  setLoading(true);
  try {
    const res = await getProjects();
    if (res?.success) {
      // Normalize response shape
      const list =
        res.dataList ||
        (Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);

      // ✅ Try to get saved order
      const savedOrder = localStorage.getItem("projectOrder");
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);
          // Reorder according to saved order, fallback to backend order for new/missing items
          const orderedList = order
            .map((id) => list.find((p) => p.id === id))
            .filter(Boolean)
            .concat(list.filter((p) => !order.includes(p.id)));

          // Ensure all projects appear
          setProjects(orderedList.length ? orderedList : list);
        } catch (err) {
          console.warn("Invalid projectOrder format, using backend order.");
          setProjects(list);
        }
      } else {
        // No saved order → backend order
        setProjects(list);
      }
    } else {
      console.error(res.message || "Failed to load projects.");
    }
  } catch (err) {
    console.error("Error fetching projects:", err);
  } finally {
    setLoading(false);
  }
}, []);



  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className={`min-h-screen py-20 px-4 sm:px-8 transition-colors duration-500 ${theme.bg} ${theme.text}`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center mb-14"
      >
        <h2 className={`text-3xl sm:text-4xl font-extrabold mb-3 ${theme.accent}`}>
          Featured Projects
        </h2>
        <p className="opacity-80 max-w-2xl mx-auto">
          A showcase of my most impactful work — crafted with precision and passion.
        </p>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.border}`}
          />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center opacity-70">No projects available yet.</div>
      ) : (
        <>
          {/* Featured Section */}
          {featured.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
            >
              {featured.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  theme={theme}
                  themeName={themeName}
                  delay={i * 0.1}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          )}

          {/* Other Projects */}
          {others.length > 0 && (
            <>
              <h3 className={`text-2xl font-semibold text-center mb-10 ${theme.accent}`}>
                More Projects
              </h3>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              >
                {others.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    theme={theme}
                    themeName={themeName}
                    delay={i * 0.1}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          theme={theme}
        />
      )}
    </section>
  );
};

const accentGlow = {
  blackgold: "hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]",
  lightblue: "hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]",
  forest: "hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
  lavender: "hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]",
  cyberpunk: "hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]",
};

const ProjectCard = ({ project, theme, themeName, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    onClick={onClick}
    className={`cursor-pointer rounded-2xl overflow-hidden border ${theme.border} ${accentGlow[themeName]} hover:-translate-y-1 transition-all duration-300 group`}
  >
    {/* Image */}
    <div className="relative w-full h-56 overflow-hidden">
      <img
        src={project.imageUrl || "/noimage.jpg"}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded-full ${theme.btn}`}
          >
            <Github size={18} />
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded-full ${theme.btn}`}
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>
    </div>

    {/* Info */}
    <div className="p-5">
      <h3 className={`text-lg font-semibold mb-1 ${theme.accent}`}>
        {project.title}
      </h3>
      <p className="text-sm opacity-80 line-clamp-2 mb-3">{project.subtitle}</p>
      <div className="flex flex-wrap gap-2 text-xs opacity-90">
        {(Array.isArray(project.technologies)
          ? project.technologies
          : project.technologies?.split(",") || []
        )
          .slice(0, 4)
          .map((t, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full border ${theme.border}`}
            >
              {t.trim()}
            </span>
          ))}
      </div>
    </div>
  </motion.div>
);

export default Projects;
