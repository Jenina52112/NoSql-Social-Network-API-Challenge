const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET thought by Id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { thoughts: newThought._id } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(newThought);
  } catch (err) {
    console.error('Error creating thought:', err);
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
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    // Use the pull method to remove the reaction
    thought.reactions.pull({ reactionId: req.params.reactionId });
    await thought.save();
    res.json(thought);
  } catch (err) {
    console.error('Error removing reaction:', err);
    res.status(500).json(err);
  }
});



//DELETE to remove all thoughts associated with a specific username
router.delete('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find and delete all thoughts associated with the username
    const result = await Thought.deleteMany({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No thoughts found for this username' });
    }

    // Remove the deleted thought IDs from the user's thoughts array
    await User.updateMany(
      { username },
      { $pull: { thoughts: { $in: result.deletedCount } } }
    );

    res.status(200).json({ message: `Deleted ${result.deletedCount} thoughts for username ${username}` });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
