import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and MP4 Videos only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post('/', upload.array('media', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No multi-media uploaded');
  }

  const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
  res.json({ message: 'Files uploaded securely', paths: filePaths });
});

export default router;
