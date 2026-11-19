const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Photo = require('../models/Photo');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
console.log('Photo router initialized');

// Configure image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Accept image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload photo
console.log('GET PHOTOS ROUTE REGISTERED');
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image' });
    }

    const photo = await Photo.create({
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'Other',
      imageUrl: `/uploads/${req.file.filename}`,
      user: req.user.id
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    res.status(500).json({ message: 'Photo upload failed' });
  }
});
// Get all photos uploaded by the logged-in user
router.get('/', (req, res, next) => {
  console.log('GET PHOTOS REQUEST RECEIVED');
  next();
}, authMiddleware, async (req, res) => {
  try {
    const photos = await Photo.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch photos'
    });
  }
});
// Delete photo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!photo) {
      return res.status(404).json({
        message: 'Photo not found'
      });
    }

    const imagePath = path.join(__dirname, '..', photo.imageUrl);

    await fs.unlink(imagePath).catch(() => {});

    await photo.deleteOne();

    res.json({
      message: 'Photo deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete photo'
    });
  }
});
// Edit photo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!photo) {
      return res.status(404).json({
        message: 'Photo not found'
      });
    }

    photo.title = req.body.title || photo.title;
    photo.description = req.body.description ?? photo.description;
    photo.category = req.body.category || photo.category;

    await photo.save();

    res.json({
      message: 'Photo updated successfully',
      photo
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to update photo'
    });
  }
});
module.exports = router;