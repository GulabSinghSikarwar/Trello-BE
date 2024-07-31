const Task = require('../../models/Tasks');
const {logger} =require('../../services/logger')
const migrateTasks = async () => {
  try {
    
    const tasks = await Task.find();
    logger.info("Tasks fetched: ", tasks.length);

    for (const task of tasks) {
      logger.info("Processing task:", task._id); // Log task ID or a unique identifier

      // Add default values for new fields if they don't exist
      if (!task.priority) {
        task.priority = 'Medium';
      } else if (!['Low', 'Medium', 'High', 'Blocker', 'Critical'].includes(task.priority)) {
        task.priority = 'Medium'; // Fallback to default if priority is invalid
      }

      if (task.dueDate === undefined) {
        task.dueDate = null;
      }
      if (!Array.isArray(task.tags)) {
        task.tags = [];
      }
      if (!Array.isArray(task.assignees)) {
        task.assignees = [];
      }
      if (!Array.isArray(task.subtasks)) {
        task.subtasks = [];
      }
      if (!Array.isArray(task.comments)) {
        task.comments = [];
      }
      if (!Array.isArray(task.attachments)) {
        task.attachments = [];
      }

      if (!task.currentAssignee) {
        task.currentAssignee = task.userId; // Set currentAssignee to creator if missing
      }

      // Save the updated task and log
      try {
        await task.save();
        logger.info("Task migrated:", task._id);
      } catch (saveError) {
      logger.error("Error saving task:", task._id, saveError);
      }
    }

    logger.info("Task migrations completed.");
  } catch (error) {
  logger.error("Error during task migration:", error);
  }
};

module.exports = migrateTasks;
