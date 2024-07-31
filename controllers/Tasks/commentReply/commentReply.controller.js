const Reply = require('../../../models/Reply');
const { logger } = require('../../../services/logger');
const Comment = require('../../../models/Comment');

const createReply = async (req, res) => {
  try {
    const { commentId, author, content, profilePicture } = req.body;

    if (!commentId || !author || !content) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    console.log("HERE new reply");
    let newReply;
    try {
      newReply = new Reply({
        commentId,
        author,
        content,
        profilePicture
      });
    } catch (error) {
      logger.error('Error creating reply instance:', error);
      return res.status(400).json({ error: 'Invalid data for reply creation' });
    }

    let savedReply;
    try {
      savedReply = await newReply.save();
    } catch (error) {
      logger.error('Error saving reply:', error);
      return res.status(500).json({ error: 'Error saving reply' });
    }

    try {
      const updateComment = await Comment.findByIdAndUpdate(commentId, {
        $push: { replies: savedReply._id }
      });
      logger.info(`comment updated : ${updateComment}`)
    } catch (error) {
      logger.error('Error updating comment with reply ID:', error);
      return res.status(500).json({ error: 'Error updating comment' });
    }

    logger.debug(`Reply Created: ${savedReply}`);
    res.status(201).json(savedReply);
  } catch (error) {
    logger.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createReply };
