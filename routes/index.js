const express = require('express');
const router = express.Router();

const authRouter = require('./auth/auth.route');
const taskRouter = require('./tasks/task.route')

router.use('/auth', authRouter);
router.use('/task', taskRouter);

module.exports = router;
