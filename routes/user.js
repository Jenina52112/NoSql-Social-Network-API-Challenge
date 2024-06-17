const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Find user by Id
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('thoughts');
      if(!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// POST create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete user with id: ${req.params.id}`);
    
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User and associated thoughts deleted');
    res.status(200).json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json(err);
  }
});

// Add a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.friends.includes(req.params.friendId)) {
      user.friends.push(req.params.friendId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post('/', async (req, res) => {
//   try {
//     const newThought = await Thought.create(req.body);
//     const user = await User.findByIdAndUpdate(
//       req.body.userId,
//       { $push: { thoughts: newThought._id } },
//       { new: true, useFindAndModify: false }
//     );
//     res.status(200).json(newThought);
//   } catch (err) {
//     console.error('Error creating thought:', err);
//     res.status(500).json(err);
//   }
// });


// Remove a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.friends.pull(req.params.friendId);
    await user.save();
    res.json({ message: 'Friend deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
