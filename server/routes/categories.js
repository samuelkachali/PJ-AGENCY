const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// Create category
router.post('/', auth, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// List categories
router.get('/', async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json(categories);
});

// Update category
router.put('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
