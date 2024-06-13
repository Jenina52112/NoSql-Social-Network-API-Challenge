const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = new Thought(req.body);
    const thought = await newThought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update a thought
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a thought
router.delete('/:id', async (req, res) => {
  try {
    await Thought.findByIdAndDelete(req.params.id);
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    thought.reactions.push(req.body);
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    thought.reactions.id(req.params.reactionId).remove();
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
