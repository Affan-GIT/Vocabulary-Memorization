const fs = require('fs').promises;

const partsController = async (req, res) => {
  const { language } = req.params;
  parts = await getParts(language);
  res.send(parts);
};

const getParts = async (language, part) => {
  const folderPath = `../database/${language}`;
  const parts = await fs.readdir(folderPath);
  const mappedParts = parts.map((part) => part.substring(0, part.length - 4));
  return mappedParts;
};

module.exports = partsController;
