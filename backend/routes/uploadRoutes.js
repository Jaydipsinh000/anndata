import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

const router = express.Router();

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'anndata_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
    resource_type: 'auto'
  }
});

const upload = multer({
  storage
});

router.post('/', upload.array('media', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No multi-media uploaded');
  }

  const filePaths = req.files.map(file => file.path);
  res.json({ message: 'Files uploaded securely to Cloudinary', paths: filePaths });
});

export default router;
