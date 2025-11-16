// src/pages/AdminSkills.jsx
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";
import SkillForm from "./SkillForm";
import SkillCard from "./SkillCard";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkillById,
} from "../api/UserApi";

const AdminSkills = () => {
  const { theme, themeName } = useTheme();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSkills();
      if (res?.success) setSkills(res.data || []);
      else toast.error(res?.message || "Failed to fetch skills");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const openAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const openEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      const res = editingSkill
        ? await updateSkill(editingSkill.id, payload)
        : await addSkill(payload);

      if (res?.success) {
        toast.success(res.message || (editingSkill ? "Skill updated" : "Skill added"));
        setShowForm(false);
        setEditingSkill(null);
        await loadSkills();
      } else {
        toast.error(res?.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving skill");
    } finally {
      setSaving(false);
    }
  };

  // ⭐ Modern Delete Confirmation (SweetAlert2)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Skill?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, delete",
      backdrop: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteSkillById(id);
      if (res?.success) {
        toast.success(res.message || "Skill deleted");
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting skill");
    }
  };

  return (
    <div className={`p-6 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-semibold ${theme.accent}`}>Manage Skills</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={openAdd}
            className={`${theme.btn} px-4 py-2 rounded-md`}
          >
            Add Skill
          </button>
          <button
            onClick={loadSkills}
            className="px-3 py-2 rounded-md border"
            aria-label="Refresh skills"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center opacity-60">Loading skills...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.length === 0 ? (
            <div className="col-span-full text-center opacity-60">No skills found.</div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => openEdit(skill)}
                onDelete={() => handleDelete(skill.id)}
                theme={theme}
                themeName={themeName}
              />
            ))
          )}
        </div>
      )}

      {showForm && (
        <SkillForm
          initialData={editingSkill}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSkill(null);
          }}
          saving={saving}
          theme={theme}
          themeName={themeName}
        />
      )}
    </div>
  );
};

export default AdminSkills;
