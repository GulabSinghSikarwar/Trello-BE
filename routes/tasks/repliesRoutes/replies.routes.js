const router = require('express').Router()
const repliesController = require('../../../controllers/Tasks/commentReply/commentReply.controller')

router.post('/', repliesController.createReply)

module.exports = router;