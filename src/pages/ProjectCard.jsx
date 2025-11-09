// src/pages/admin/ProjectCard.jsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";

/**
 * Compact project card used in admin list.
 * - onOpen: open detail modal
 * - onEdit: start editing
 * - onDelete: show delete confirmation
 */
const ProjectCard = React.memo(function ProjectCard({ project, onOpen, onEdit, onDelete }) {
  const techs = Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies;

  return (
    <button
      onClick={() => onOpen(project)}
      className="group text-left rounded-2xl border p-4 shadow-sm flex flex-col justify-between bg-white dark:bg-gray-900 hover:shadow-lg transition"
      aria-label={`Open ${project.title}`}
      type="button"
    >
      <div>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-36 object-cover rounded-md mb-3"
          />
        ) : (
          <div className="w-full h-36 rounded-md mb-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}

        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-xs opacity-80 mt-1 line-clamp-2">{techs}</p>
      </div>

      <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs italic text-gray-500">{project.type}</div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="px-2 py-1 rounded-md text-sm hover:bg-gray-100"
            aria-label="Edit"
            type="button"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="px-2 py-1 rounded-md text-sm hover:bg-gray-100 text-red-500"
            aria-label="Delete"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </button>
  );
});

export default ProjectCard;
