  const convertTime = (timeString) => {
    if (!timeString) return new Date().toISOString();
    if (typeof timeString === 'string' && !isNaN(timeString)) {
      const timestamp = parseInt(timeString);
      if (timestamp > 1000000000) {
        return new Date(timestamp * 1000).toISOString();
      } else {
        console.warn('Possible invalid timestamp:', timeString);
        return new Date().toISOString();
      }
    }
    return new Date(timeString).toISOString();
};
export default convertTime