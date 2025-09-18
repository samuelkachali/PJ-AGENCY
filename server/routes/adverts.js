const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Advert = require('../models/Advert');
const auth = require('../middleware/auth');
const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// Create advert
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const images = (req.files || []).map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      path: '/uploads/' + f.filename,
      size: f.size
    }));
    const advert = await Advert.create({ ...req.body, images, createdBy: req.user.id });
    res.status(201).json(advert);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// List adverts (with filters)
router.get('/', async (req, res) => {
  const { category, status, q, featured, hot } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (typeof featured !== 'undefined') filter.featured = ['1', 'true', true, 1, 'yes'].includes(featured);

  // Hot deals: either explicitly flagged, or salePrice <= 50% of price
  if (typeof hot !== 'undefined' && ['1', 'true', true, 1, 'yes'].includes(hot)) {
    filter.$or = [
      { isHot: true },
      {
        $expr: {
          $and: [
            { $ne: ['$salePrice', null] },
            { $lte: ['$salePrice', { $multiply: ['$price', 0.5] }] }
          ]
        }
      }
    ];
  }

  const adverts = await Advert.find(filter).populate('category').sort('-createdAt');
  res.json(adverts);
});

// Single advert
router.get('/:id', async (req, res) => {
  const advert = await Advert.findById(req.params.id).populate('category');
  if (!advert) return res.status(404).json({ message: 'Not found' });
  res.json(advert);
});

// Update advert
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const images = (req.files || []).map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      path: '/uploads/' + f.filename,
      size: f.size
    }));

    // Use atomic operators to avoid mixing plain fields with $ operators
    const set = { ...req.body };

    // If status is set to sold, schedule auto-delete in 3 hours
    if (set.status === 'sold') {
      set.deleteAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
    }
    // If status is changed back from sold, clear any scheduled deletion
    if (set.status && set.status !== 'sold') {
      set.deleteAt = null;
    }

    const update = { $set: set };
    if (images.length) update.$push = { images: { $each: images } };

    const advert = await Advert.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(advert);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Delete advert
router.delete('/:id', auth, async (req, res) => {
  try {
    await Advert.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
