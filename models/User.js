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

//Add virtual for friend count
// userSchema.virtual('friendCount').get(function() {
//   return this.friends.length;
// });

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// Set the toJSON option
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false, // Removes the __v field
  transform: (doc, ret) => {
    delete ret.__v;
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
