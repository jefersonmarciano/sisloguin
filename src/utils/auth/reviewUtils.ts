export const shouldResetReviews = (lastReset: Date | string | null): boolean => {
  const now = new Date();

  if (!lastReset) return true;

  const resetDate = new Date(lastReset); // convert string to Date

  return now.getTime() - resetDate.getTime() > 24 * 60 * 60 * 1000;
};
