// src/utils/calculateExperience.js
export const calculateTotalExperience = (companies) => {
  let totalMonths = 0;

  companies.forEach((company) => {
    company.experiences.forEach((exp) => {
      const startParts = exp.startDate.split("-");
      const start = new Date(startParts[2], startParts[1] - 1, startParts[0]);
      const end = exp.isCurrentCompany
        ? new Date()
        : exp.endDate
        ? new Date(exp.endDate.split("-")[2], exp.endDate.split("-")[1] - 1, exp.endDate.split("-")[0])
        : new Date();

      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += diffMonths > 0 ? diffMonths : 0;
    });
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} yrs ${months} mos`;
};
