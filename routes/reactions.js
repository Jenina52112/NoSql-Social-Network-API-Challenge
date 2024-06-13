
const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// POST a new reaction
router.post('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reaction = {
      reactionBody: req.body.reactionBody,
      user: req.body.userId,
      createdAt: new Date()
    };

    thought.reactions.push(reaction);
    await thought.save();

    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a reaction by ID
router.delete('/:thoughtId/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const reactionIndex = thought.reactions.findIndex(
      reaction => reaction.id === req.params.reactionId
    );

    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    thought.reactions.splice(reactionIndex, 1);
    await thought.save();

    res.json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
