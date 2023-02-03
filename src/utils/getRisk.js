export const getRisk = (score) => {
  if (score < 4) return 'High';
  if (score < 8) return 'Medium';
  return 'Low';
};
