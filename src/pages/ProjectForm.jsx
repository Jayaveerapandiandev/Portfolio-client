// src/pages/admin/ProjectForm.jsx
import React from "react";

const ProjectForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  theme,
  handleImageUpload,
  saving,
}) => {
  const modernTypes = [
    "Web Application",
    "Frontend Application",
    "Backend Application",
    "Full Stack Project",
    "API Service",
    "Mobile Application",
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {/* Title */}
      <FormInput
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
        placeholder="Enter project title"
        theme={theme}
        required
      />

      {/* Subtitle */}
      <FormInput
        label="Subtitle"
        value={formData.subtitle}
        onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
        placeholder="Short summary"
        theme={theme}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
          rows={5}
          maxLength={3000}
          className={`w-full p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text} focus:outline-none focus:ring-2 ${theme.accent.replace("text-", "ring-")} resize-none`}
          placeholder="Detailed project description (up to 3000 characters)"
        />
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Project Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
          className={`w-full p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text} focus:outline-none focus:ring-2 ${theme.accent.replace("text-", "ring-")}`}
        >
          <option value="">Select Type</option>
          {modernTypes.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Technologies */}
      <FormInput
        label="Technologies"
        value={formData.technologies}
        onChange={(e) =>
          setFormData((p) => ({ ...p, technologies: e.target.value }))
        }
        placeholder="Technologies (comma separated)"
        theme={theme}
      />

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Project Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={`w-full text-sm ${theme.text}`}
        />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="preview"
            className="w-32 h-20 object-cover mt-2 rounded-md border"
          />
        )}
      </div>

      {/* GitHub, Live, Dates */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormInput
          label="GitHub URL"
          type="url"
          value={formData.githubUrl}
          onChange={(e) =>
            setFormData((p) => ({ ...p, githubUrl: e.target.value }))
          }
          placeholder="https://github.com/..."
          theme={theme}
        />
        <FormInput
          label="Live URL"
          type="url"
          value={formData.liveUrl}
          onChange={(e) =>
            setFormData((p) => ({ ...p, liveUrl: e.target.value }))
          }
          placeholder="https://..."
          theme={theme}
        />
        <FormInput
          label="From"
          type="date"
          value={formData.dateFrom}
          onChange={(e) =>
            setFormData((p) => ({ ...p, dateFrom: e.target.value }))
          }
          theme={theme}
        />
        <FormInput
          label="To"
          type="date"
          value={formData.dateTo}
          onChange={(e) =>
            setFormData((p) => ({ ...p, dateTo: e.target.value }))
          }
          theme={theme}
        />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center justify-end gap-2">
        <label className="text-sm flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) =>
              setFormData((p) => ({ ...p, featured: e.target.checked }))
            }
            className={`w-4 h-4 ${theme.accent.replace("text-", "accent-")}`}
          />
          Featured Project
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md border ${theme.border} hover:opacity-70 transition`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded-md ${theme.btn} transition`}
        >
          {saving ? "Saving..." : formData.id ? "Update" : "Add Project"}
        </button>
      </div>
    </form>
  );
};

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  theme,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text} focus:outline-none focus:ring-2 ${theme.accent.replace("text-", "ring-")}`}
      placeholder={placeholder}
    />
  </div>
);

export default ProjectForm;
