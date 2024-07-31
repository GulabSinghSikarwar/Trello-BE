const { StatusCode } = require('../../../constants');
const Comment = require('../../../models/Comment');
const Reply = require('../../../models/Reply');
const Task = require('../../../models/Tasks');
const { logger } = require('../../../services/logger');

const createComment = async (req, res) => {
  logger.debug("Entering createComment function");

  try {
    const { content, taskId, userId, profilePicture } = req.body;

    logger.info("Received request to create comment with data:", { content, taskId, userId, profilePicture });

    const newComment = new Comment({
      content,
      taskId,
      userId,
      profilePicture
    });

    const savedComment = await newComment.save();
    logger.info("Comment successfully saved:", { commentId: savedComment._id });

    const updatedTask = await Task.findByIdAndUpdate(savedComment.taskId, {
      $push: { comments: savedComment._id }
    });

    logger.info("Task successfully updated with new comment:", { taskId: savedComment.taskId, updatedTaskId: updatedTask._id });

    return res.status(201).json(savedComment);
  } catch (error) {
    logger.error("Error occurred while creating comment:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
  }
};

const fetchAllcomments = async (req, res) => {
  logger.debug("Entering fetchAllcomments function");

  try {
    const { id } = req.params;
    const taskId = id

    logger.info("Fetching comments for task:", req.params);

    // Find the task and populate comments and their replies
    const task = await Task.findById(taskId).populate({
      path: 'comments',
      populate: {
        path: 'replies'
      }
    });

    if (!task) {
      logger.warn("Task not found:", { taskId });
      return res.status(404).json({ error: 'Task not found' });
    }

    logger.info("Successfully fetched comments for task:", { taskId });
    res.status(200).json(task.comments);
  } catch (error) {
    logger.error("Error occurred while fetching comments with replies:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createComment, fetchAllcomments };


