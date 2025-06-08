const getTimeAgo = (timeString) => {
  const now = new Date();
  const past = new Date(timeString);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} روز پیش`;
  if (diffHours > 0) return `${diffHours} ساعت پیش`;
  if (diffMinutes > 0) return `${diffMinutes} دقیقه پیش`;
  return `${diffSeconds} ثانیه پیش`;
};
export default getTimeAgo