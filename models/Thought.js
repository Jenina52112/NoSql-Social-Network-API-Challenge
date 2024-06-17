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
    get: (timestamp) => new Date(timestamp).toLocaleString(),
  },
  username: {
    type: String,
    required: true,
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


//virtual for reaction count
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Set the toJSON option
thoughtSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

thoughtSchema.set('toObject', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// reactionSchema.find({}).select('-_id reactionId reactionBody username createdAt')
//   .then(data => {
//     res.json(data);
//   })
//   .catch(err => {
//     res.json(err);
//   });

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
