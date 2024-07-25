const mongoose = require('mongoose')
const { connectDB } = require('../db')
const Tasks = require('../../models/Tasks');
const migrateTasks = require('./migrateTask');

const migrate = async () => {
    await connectDB();
    await migrateTasks();
}
migrate()