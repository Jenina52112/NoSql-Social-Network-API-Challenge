// routes/thoughts.js

const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('user', 'username');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single thought by ID
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('user', 'username');
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const thought = new Thought({
      thoughtText: req.body.thoughtText,
      user: req.body.userId,
      createdAt: new Date()
    });

    const newThought = await thought.save();
    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a thought by ID
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    if (req.body.thoughtText != null) {
      thought.thoughtText = req.body.thoughtText;
    }

    const updatedThought = await thought.save();
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a thought by ID
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    await thought.remove();
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
