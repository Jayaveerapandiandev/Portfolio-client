// src/components/skills/SkillForm.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SkillForm = ({ initialData = null, onSubmit, onClose, saving, theme, themeName }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    proficiency: 60,
    experienceYears: 1,
    logoUrl: "",
    isHighlighted: false,
  });

  /* -------- Load Form for Edit Mode -------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        proficiency: initialData.proficiency ?? 60,
        experienceYears: initialData.experienceYears ?? 1,
        logoUrl: initialData.logoUrl || "",
        isHighlighted: initialData.isHighlighted ?? false,
      });
    }
  }, [initialData]);

  /* -------- Generic Input Change -------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------- Submit Form -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Skill name is required");
    if (!form.category.trim()) return toast.error("Category is required");

    await onSubmit({
      ...form,
      proficiency: Number(form.proficiency),
      experienceYears: Number(form.experienceYears),
    });
  };

  const categories = [
    "Frontend",
    "Backend",
    "Database",
    "Tools",
    "Frameworks",
    "DevOps",
    "Mobile",
    "Languages",
    "ORM/Data Access"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <form
        onSubmit={handleSubmit}
        className={`max-w-2xl w-full rounded-2xl p-6 border ${theme.border} ${
          themeName === "lightblue" || themeName === "lavender"
            ? "bg-white text-gray-800"
            : "bg-gray-900 text-gray-100"
        } shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        <h2 className="col-span-2 text-xl font-bold mb-2 tracking-wide">
          {initialData ? "Edit Skill" : "Add New Skill"}
        </h2>

        {/* Skill Name */}
        <div>
          <label className="text-sm font-medium mb-1 block">Skill Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={`p-2 rounded-md w-full border ${theme.border} ${theme.bg} ${theme.text}`}
            placeholder="React, Docker, .NET"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={`p-2 rounded-md w-full border ${theme.border} ${theme.bg} ${theme.text}`}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Proficiency */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Proficiency ({form.proficiency}%)
          </label>
          <input
            type="range"
            name="proficiency"
            min="0"
            max="100"
            value={form.proficiency}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-medium mb-1 block">Experience (Years)</label>
          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            min="0"
            className={`p-2 rounded-md w-full border ${theme.border} ${theme.bg} ${theme.text}`}
          />
        </div>

        {/* Logo URL Input */}
        <div className="col-span-2">
          <label className="text-sm font-medium block mb-1">Logo URL (CDN / Cloudinary)</label>

          <input
            type="text"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="Paste logo URL"
            className={`w-full p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
          />

          {/* Live Preview */}
          {form.logoUrl && (
            <img
              src={form.logoUrl}
              onError={(e) => (e.target.style.display = "none")}
              alt="logo preview"
              className="h-20 mt-3 border rounded-md object-contain bg-white p-2"
            />
          )}
        </div>

        {/* Highlight */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="isHighlighted"
            checked={form.isHighlighted}
            onChange={handleChange}
          />
          Highlight this skill
        </label>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${theme.btn} opacity-90`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-md ${theme.btn} disabled:opacity-50`}
          >
            {saving ? "Saving..." : initialData ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
