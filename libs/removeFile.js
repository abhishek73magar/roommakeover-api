const fs = require("fs");

exports.removeFile = (path) => {
  try {
    fs.unlinkSync('public/' +path);
    return true;
  } catch (error) {
    return true;
  }
};

exports.removeAllFiles = (path, files) => {
  if (!files || !Array.isArray(files)) return;
  files.forEach((file) => {
    this.removeFile(`${path}${file.filename}`);
  });
};
