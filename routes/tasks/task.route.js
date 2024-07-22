const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const Task = require('../../models/Tasks')
const { Types } = require('mongoose')
const { ObjectId } = require('mongodb');
const { formatTaskStatus, formatAllTasks } = require('./task.util')
const { updateTaskStatus } = require('../../controllers/Tasks/task.controller')
// Create a new task

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const task = new Task({ title: req.body.title, content: req.body.content, status: req.body.status, userId: user._id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// Get all tasks for a user
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    console.log(".............");
    console.log("User id : ", userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const id = new ObjectId(userId)
    const tasks = await Task.aggregate([
      {
        $match: { userId: id }
      },
      {
        $group: {
          _id: "$status",
          tasks: { $push: "$$ROOT" } // use $$ROOT to include the entire document
        }
      },
      {
        $project: {
          _id: 0,
          columnId: "$_id",
          title: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Pending"] }, then: "To Do" },
                { case: { $eq: ["$_id", "In Process"] }, then: "In Progress" },
                { case: { $eq: ["$_id", "Completed"] }, then: "Done" }
              ]
            }
          },
          tasks: 1 // include the tasks array in the output
        }
      }
    ]);

    const allTasks = await Task.find({
      userId: id
    })
    const response = {
      tasks: formatAllTasks(allTasks),
      columns: formatTaskStatus(tasks)
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// // Get a single task
// router.get('/:id', async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     if (task.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching task' });
//   }
// });

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    task.title = req.body.title;
    task.content = req.body.content;
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});
router.patch('/:taskId/status', updateTaskStatus);

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    await task.remove();
    res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;