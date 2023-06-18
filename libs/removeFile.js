const fs = require("fs");

exports.removeFile = (path) => {
  const pathArr = path.split("/");
  const filename = name.pop();
  const dest = pathArr.join("/");
  const dir = fs.readdirSync(dest);
  // console.log(dir, filename);
  if (dir.includes(filename)) {
    fs.unlinkSync(dest + "/" + filename);
  }
  return true;
};
