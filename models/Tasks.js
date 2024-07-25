const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Process', 'Completed'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    tags: [{
        type: String
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    subtasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    attachments: [{
        type: Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currentAssigne: { type: String }
});

taskSchema.pre('save', function (next) {
    if (this.isNew) {
        this.currentAssigne = this.creator; // Set currentAssigne to creator on task creation
    }
    next();
});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
