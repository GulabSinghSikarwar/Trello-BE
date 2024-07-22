
const Task = require('../../models/Tasks')

const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status, userId } = req.body;
    // const userId = req.user._id; // Assuming user is attached to req

    try {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        task.status = status;
        task.updatedAt = Date.now();
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status', error });
    }
};

module.exports = { updateTaskStatus }