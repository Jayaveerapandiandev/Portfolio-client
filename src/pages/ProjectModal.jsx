import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const ProjectModal = ({ project, onClose, theme }) => {
  if (!project) return null;

  const techs = Array.isArray(project.technologies)
    ? project.technologies
    : project.technologies
    ? project.technologies.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Scrollable modal container */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative z-[61] w-full max-w-3xl my-8 overflow-y-auto rounded-2xl shadow-2xl modern-scroll"
        style={{
          maxHeight: "90vh",
        }}
      >
        {/* Modal body */}
        <div className={`${theme.bg} ${theme.text} border ${theme.border}`}>
          {/* Header */}
          <div
            className={`flex items-start justify-between p-5 border-b ${theme.border}`}
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {project.title}
              </h2>
              {project.subtitle && (
                <p className="text-sm opacity-80">{project.subtitle}</p>
              )}
              <div className="mt-1 text-xs italic opacity-70">
                {project.type} • {project.dateFrom || project.date || "No date"}
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:${theme.hoverBg} transition`}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image */}
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full object-cover max-h-[400px]"
            />
          ) : (
            <div
              className={`w-full h-56 flex items-center justify-center text-gray-500 ${theme.bgAlt}`}
            >
              No image available
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Technologies */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Technologies</h4>
              {techs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {techs.map((t, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 text-xs rounded-full border ${theme.border} ${theme.text} hover:${theme.accent.replace(
                        "text-",
                        "border-"
                      )} hover:scale-105 transition-transform`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-80">No technologies listed.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-lg mb-1">Description</h4>
              <p className="text-sm opacity-90 whitespace-pre-wrap leading-relaxed">
                {project.description || "No description provided."}
              </p>
            </div>

            {/* Links & Status */}
            <div className="flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-4 py-2 rounded-md font-medium transition ${theme.btn}`}
                >
                  View Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-4 py-2 rounded-md font-medium transition ${theme.btn}`}
                >
                  Live Demo
                </a>
              )}
              {project.status && (
                <div className="ml-auto text-xs italic opacity-70">
                  {project.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;
