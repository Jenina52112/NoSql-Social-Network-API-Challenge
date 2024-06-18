const mongoose = require('mongoose');
const Thought = require('./Thought');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ],
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// Set the toJSON option
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    // Remove the __v field
    delete ret.__v;

    // Iterate through thoughts and remove the 'id' field from reactions
    if (ret.thoughts) {
      ret.thoughts.forEach(thought => {
        if (thought.reactions) {
          thought.reactions.forEach(reaction => {
            delete reaction.id;
          });
        }
        delete thought.id; // Remove the 'id' field from thought itself
      });
    }

    // Remove 'id' field from friends
    if (ret.friends) {
      ret.friends.forEach(friend => {
        delete friend.id;
      });
    }

    return ret;
  },
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    // Remove the __v field
    delete ret.__v;

    // Iterate through thoughts and remove the 'id' field from reactions
    if (ret.thoughts) {
      ret.thoughts.forEach(thought => {
        if (thought.reactions) {
          thought.reactions.forEach(reaction => {
            delete reaction.id;
          });
        }
        delete thought.id; // Remove the 'id' field from thought itself
      });
    }

    // Remove 'id' field from friends
    if (ret.friends) {
      ret.friends.forEach(friend => {
        delete friend.id;
      });
    }

    return ret;
  },
});

// Pre hook to remove associated thoughts when a user is deleted
userSchema.pre('findOneAndDelete', async function(next) {
  try {
    const user = await this.model.findOne(this.getQuery());
    console.log(`Deleting thoughts for user: ${user.username}`);
    const result = await Thought.deleteMany({ username: user.username });
    console.log(`Deleted ${result.deletedCount} thoughts.`);
    next();
  } catch (err) {
    console.error('Error deleting thoughts:', err);
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
