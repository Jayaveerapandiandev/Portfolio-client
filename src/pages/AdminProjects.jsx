import React, { useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Plus, FolderKanban, GripVertical } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ProjectForm from "./ProjectForm";
import ProjectModal from "./ProjectModal";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../api/UserApi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🔹 Memoized Project Card with drag handle
const ProjectCard = memo(({ project, theme, onEdit, onDelete, onDetail }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={() => onDetail(project)}
    className={`group rounded-2xl border ${theme.border} ${theme.bg} ${theme.text} shadow-md hover:shadow-xl transition flex flex-col overflow-hidden cursor-pointer`}
  >
    {project.imageUrl ? (
      <img
        src={project.imageUrl}
        alt={project.title}
        loading="lazy"
        className="w-full h-40 object-cover"
      />
    ) : (
      <div className="w-full h-40 flex items-center justify-center bg-gray-100/20 text-gray-400 text-sm">
        No image
      </div>
    )}

    <div className="p-4 flex flex-col justify-between flex-1">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <GripVertical
          size={16}
          className="opacity-0 group-hover:opacity-60 transition cursor-grab"
          title="Drag to reorder"
        />
      </div>

      <p className="text-xs opacity-80 mt-1 line-clamp-2">
        {Array.isArray(project.technologies)
          ? project.technologies.join(", ")
          : project.technologies}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
        <div className="text-xs italic opacity-70">{project.type}</div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="px-2 py-1 rounded-md text-sm hover:bg-gray-100/10"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="px-2 py-1 rounded-md text-sm text-red-500 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </motion.div>
));

const AdminProjects = () => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    type: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    dateFrom: "",
    dateTo: "",
    status: "",
  });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 🔹 Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res?.dataList || res?.data || []);
    } catch {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Load projects and restore order from localStorage
  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
      const savedOrder = localStorage.getItem("projectOrder");
      if (savedOrder) {
        const order = JSON.parse(savedOrder);
        setProjects((prev) =>
          order
            .map((id) => prev.find((p) => p.id === id))
            .filter(Boolean)
            .concat(prev.filter((p) => !order.includes(p.id))) // append new ones
        );
      }
    };
    loadProjects();
  }, [fetchProjects]);

  // 🔹 Cloudinary upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloud = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) return toast.error("Cloudinary not configured");

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        toast.success("Image uploaded", { id: toastId });
      } else toast.error("Upload failed", { id: toastId });
    } catch {
      toast.error("Upload error", { id: toastId });
    }
  };

  // 🔹 Save project
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          ? formData.technologies.split(",").map((t) => t.trim())
          : [],
      };
      const res = editing
        ? await updateProject(editing.id, payload)
        : await addProject(payload);

      if (res?.success) {
        toast.success(editing ? "Project updated" : "Project added");
        cancelEdit();
        fetchProjects();
      } else toast.error(res?.message || "Save failed");
    } catch {
      toast.error("Save error");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Edit / Cancel
  const startEdit = (p) => {
    setEditing(p);
    setFormData({
      ...p,
      technologies: Array.isArray(p.technologies)
        ? p.technologies.join(", ")
        : p.technologies || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      type: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: false,
      dateFrom: "",
      dateTo: "",
      status: "",
    });
  };

  // 🔹 Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProject(deleteTarget);
      if (res?.success) {
        toast.success("Project deleted");
        fetchProjects();
      } else toast.error(res?.message || "Delete failed");
    } catch {
      toast.error("Delete error");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // 🔹 Project Type Options
  const modernProjectTypes = [
    "Web Application",
    "Frontend UI",
    "Backend API",
    "Mobile Application",
    "Full-Stack Project",
    "Portfolio / Showcase",
  ];

  return (
    <section className={`min-h-screen p-8 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-3xl font-extrabold flex items-center gap-3 ${theme.text}`}
        >
          <FolderKanban
            className={`${theme.accent.replace("text-", "text-")} w-8 h-8`}
          />
          <span className="tracking-tight">Admin Projects</span>
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={cancelEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.text} hover:opacity-80 transition-all duration-200`}
        >
          <Plus
            size={18}
            className={`${theme.accent.replace("text-", "text-")}`}
          />
          <span>Add New</span>
        </motion.button>
      </div>

      {/* Form */}
      <motion.div
        layout
        className={`rounded-2xl border ${theme.border} ${theme.bg} shadow-md p-6 mb-12`}
      >
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSave}
          onCancel={cancelEdit}
          projectTypes={modernProjectTypes}
          theme={theme}
          handleImageUpload={handleImageUpload}
          saving={saving}
        />
      </motion.div>

      {/* 🔹 Draggable Grid */}
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          const reordered = Array.from(projects);
          const [moved] = reordered.splice(result.source.index, 1);
          reordered.splice(result.destination.index, 0, moved);
          setProjects(reordered);
          localStorage.setItem("projectOrder", JSON.stringify(reordered.map((p) => p.id)));
        }}
      >
        <Droppable droppableId="projects">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                <div className="col-span-full text-center py-12">Loading...</div>
              ) : projects.length ? (
                projects.map((p, index) => (
                  <Draggable key={p.id} draggableId={p.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ProjectCard
                          project={p}
                          theme={theme}
                          onEdit={startEdit}
                          onDelete={setDeleteTarget}
                          onDetail={setDetailProject}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No projects yet
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Detail Modal */}
      {detailProject && (
        <ProjectModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
          theme={theme}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteTarget(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-xl shadow-lg w-full max-w-sm ${theme.bg} ${theme.text} border ${theme.border}`}
          >
            <h3 className="text-lg font-semibold mb-3">Delete project?</h3>
            <p className="text-sm opacity-80 mb-4">
              This will permanently remove the project.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-3 py-2 rounded-md bg-red-600 text-white"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default AdminProjects;
