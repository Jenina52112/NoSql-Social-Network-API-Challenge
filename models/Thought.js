
const mongoose = require('mongoose');

const ThoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reactions: [{
    reactionBody: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thought', ThoughtSchema);
