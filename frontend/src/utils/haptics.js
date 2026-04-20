export const triggerHaptic = (pattern = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};
