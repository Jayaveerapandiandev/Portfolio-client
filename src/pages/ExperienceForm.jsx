import React, { useState } from "react";
import toast from "react-hot-toast";
import { addExperience, addExperienceForExistingCompany } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";

const ExperienceForm = ({
  mode = "newCompany",
  companyId = null,
  onSubmit,
  onSubmitSuccess,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyLocation: "",
    companyWebsite: "",
    companyLogoUrl: "",
    designation: "",
    positionTitle: "",
    startDate: "",
    endDate: "",
    isCurrentCompany: false,
    description: "",
    technologiesUsed: "",
  });

  // 🔹 Handle field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle Cloudinary upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloud = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) return toast.error("Cloudinary not configured");

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);

    const toastId = toast.loading("Uploading logo...");
    setUploading(true);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, companyLogoUrl: data.secure_url }));
        toast.success("Logo uploaded", { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Upload error", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let res;

      if (mode === "newCompany") {
        const requestPayload = {
          company: {
            name: formData.companyName,
            location: formData.companyLocation,
            website: formData.companyWebsite,
            logoUrl: formData.companyLogoUrl,
          },
          experience: {
            designation: formData.designation,
            positionTitle: formData.positionTitle,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            isCurrentCompany: formData.isCurrentCompany,
            description: formData.description,
            technologiesUsed: formData.technologiesUsed,
            parentExperienceId: null,
          },
        };
        res = await addExperience(requestPayload);
      } else if (mode === "existingCompany" && companyId) {
        const requestPayload = {
          companyId: companyId,
          experience: {
            designation: formData.designation,
            positionTitle: formData.positionTitle,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            isCurrentCompany: formData.isCurrentCompany,
            description: formData.description,
            technologiesUsed: formData.technologiesUsed,
            parentExperienceId: null,
          },
        };
        res = await addExperienceForExistingCompany(requestPayload);
      }

      if (res?.success) {
        toast.success(
          mode === "newCompany"
            ? "Company and experience added successfully"
            : "Position added successfully"
        );
        onSubmitSuccess?.();
      } else {
        toast.error(res?.message || "Failed to save");
      }

      onSubmit?.(formData);
      onCancel?.();
    } catch {
      toast.error("Error while saving experience");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl border ${theme.border} ${theme.bg} shadow-lg`}
    >
      {mode === "newCompany" && (
        <>
          <h3 className={`col-span-2 text-xl font-semibold mb-2 ${theme.text}`}>
            Company Details
          </h3>

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
          />

          <input
            type="text"
            name="companyLocation"
            placeholder="Location"
            value={formData.companyLocation}
            onChange={handleChange}
            className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
          />

          <input
            type="text"
            name="companyWebsite"
            placeholder="Website"
            value={formData.companyWebsite}
            onChange={handleChange}
            className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
          />

          <div>
            <label className="block text-sm font-semibold mb-1">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500"
            />
            {uploading && (
              <p className="text-xs text-gray-400 mt-1">Uploading...</p>
            )}
            {formData.companyLogoUrl && (
              <img
                src={formData.companyLogoUrl}
                alt="Company Logo"
                className="mt-2 h-16 rounded-md border"
              />
            )}
          </div>
        </>
      )}

      <h3 className={`col-span-2 text-xl font-semibold mt-4 mb-2 ${theme.text}`}>
        Position Details
      </h3>

      <input
        type="text"
        name="designation"
        placeholder="Designation"
        value={formData.designation}
        onChange={handleChange}
        required
        className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <input
        type="text"
        name="positionTitle"
        placeholder="Position Title"
        value={formData.positionTitle}
        onChange={handleChange}
        required
        className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        disabled={formData.isCurrentCompany}
        className={`p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <label className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          name="isCurrentCompany"
          checked={formData.isCurrentCompany}
          onChange={handleChange}
        />
        <span className={`${theme.text}`}>Currently Working Here</span>
      </label>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
        className={`col-span-2 p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <input
        type="text"
        name="technologiesUsed"
        placeholder="Technologies Used (comma separated)"
        value={formData.technologiesUsed}
        onChange={handleChange}
        className={`col-span-2 p-2 rounded-md border ${theme.border} ${theme.bg} ${theme.text}`}
      />

      <div className="col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md ${theme.btn} opacity-90`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded-md ${theme.btn} disabled:opacity-70`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
