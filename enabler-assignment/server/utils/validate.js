module.exports = (data, requiredFields) => {
  const errors = [];

  if (!data.length) {
    errors.push("File is empty");
    return errors;
  }

  requiredFields.forEach(field => {
    if (!Object.keys(data[0]).includes(field)) {
      errors.push(`Missing column: ${field}`);
    }
  });

  data.forEach((row, i) => {
    requiredFields.forEach(field => {
      if (row[field] === undefined || row[field] === null || row[field] === "") {
        errors.push(`Row ${i + 1}: Missing ${field}`);
      }
    });
  });

  return errors;
};