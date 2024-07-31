const mongoose = require('mongoose')
const { connectDB } = require('../db')
const Tasks = require('../../models/Tasks');
const migrateTasks = require('./migrateTask');
const migrateComments = require('./migrateComment');
const migrateReplies = require('./migrateReply');

const migrate = async () => {
    await connectDB();
    await migrateTasks();
    await migrateComments();
    await migrateReplies();
}
migrate()