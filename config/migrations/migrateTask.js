const mongoose = require('mongoose');
const Task = require('../../models/Tasks')


const migrateTasks = async () => {
    // console.log("HERE ");
    try {
        // console.log("HERE ");
        const tasks = await Task.find();
        console.log("Tasks fetched: ", tasks);

        for (const task of tasks) {

            console.log("Processing task:", task._id); // Log task ID or a unique identifier

            // Add default values for new fields if they don't exist
            if (!task.priority) {
                task.priority = 'Medium';
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

            if (!task.currentAssigne) {
                task.currentAssigne = task.userId; // Set currentAssigne to creator if missing
            }
            // Save the updated task and log
            try {
                await task.save();
                console.log("Task migrated:", task._id);
            } catch (saveError) {
                console.error("Error saving task:", task._id, saveError);
            }
        }

        console.log("Migrations completed.");
    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        mongoose.disconnect(); // Ensure disconnection
    }
};

module.exports = migrateTasks;
