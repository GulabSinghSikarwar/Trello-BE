const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: Schema.Types.String
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reply'
    }]
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
