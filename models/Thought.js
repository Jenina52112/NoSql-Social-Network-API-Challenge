const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxleghth: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
  },
});

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxleghth: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});


// Ensure virtual fields are serialized
thoughtSchema.set('toJSON', { getters: true, virtuals: true });
thoughtSchema.set('toObject', { getters: true, virtuals: true });

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
