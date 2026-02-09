// /pages/AdminMessages/utils.js
export const formatDate = (iso) => {
  try {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
};
