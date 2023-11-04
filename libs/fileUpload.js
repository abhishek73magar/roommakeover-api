const multer = require("multer");
const path = require("path");

exports.fileUpload = (dest) => {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const newDate = Date.now().toString();
      const extn = path.extname(file.originalname);
      const name = file.originalname.replace(extn, "");
      let filename = `${name.replace(/ /g, '_')}_${newDate.slice(7, 13)}${extn}`;
      return cb(null, filename.toLowerCase());
    },
  });
};

exports.imageFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|gif|webp|tif|png|tif|tiff|bmp|esp|avif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(
    `Error: Upload Image file only (jpg, jpeg, gif, webp, tif, png, tif,tiff, bmp, avif, esp, svg)`
  );
};
