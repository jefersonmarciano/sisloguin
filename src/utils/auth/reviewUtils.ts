
// Helper to check if reviews should be reset
export const shouldResetReviews = (lastReset: Date | null): boolean => {
  const now = new Date();
  // If no last reset or it's been more than 24 hours since last reset
  return !lastReset || now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;
};
