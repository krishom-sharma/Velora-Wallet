export const createReference = (prefix = "VLR") => {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
};
