const generateResidentCode = () => {
  // Generate 6-character alphanumeric code
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = generateResidentCode;