const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");

const normalizeKeys = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[key.trim().replace(/\s+/g, "_")] = obj[key];
  });
  return newObj;
};

const parseFile = (file) => {
  return new Promise((resolve, reject) => {
        console.log("file.mimetype",file.mimetype)
    //  Detect Excel using mimetype
    if (file.mimetype.includes("spreadsheet") || file.originalname.endsWith(".xlsx")) {
      try {
        const workbook = XLSX.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(sheet);

        data = data.map(row => {
  const normalized = normalizeKeys(row);

  if (normalized.Product_SKU) {
    normalized.Product_SKU = String(normalized.Product_SKU).trim();
  }

  return normalized;
});
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    }

    //  CSV fallback
    const results = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => results.push(normalizeKeys(data)))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

module.exports = parseFile;