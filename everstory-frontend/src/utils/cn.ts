// Utility function for joining class names conditionally
export const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
