// Get initials from string or array of strings
export const getInitials = (name: string | string[]) => {
  // Convert array to string by joining
  const nameStr = Array.isArray(name) ? name.join(" ") : name;

  if (!nameStr || nameStr.trim().length === 0) return "";

  const words = nameStr.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word - return first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words - return first character of first and last word
  const firstInitial = words[0].charAt(0);
  const lastInitial = words[words.length - 1].charAt(0);

  return (firstInitial + lastInitial).toUpperCase();
};
