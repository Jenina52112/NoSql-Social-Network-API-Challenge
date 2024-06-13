const express = require('express');
const router = express.Router();
const User = require('../models/User');

//GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//POST a new user
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email
    });
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//POST add friend
router.post('/:id/friends/:friendId', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const friend = await User.findById(req.params.friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }
        user.friends.push(friend);
        await user.save();
        res.json(user);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//DELETE remove friend
router.delete('/:id/friends/:friendId', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const friendIndex = user.friends.indexOf(req.params.friendId);
        if (friendIndex === -1) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        user.friends.splice(friendIndex, 1);
        await user.save();
        res.json(user);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;