const router = require('express').Router()
const commentController = require('../../../controllers/Tasks/taskComments/comment.controller')

router.post('/', commentController.createComment)
// router.get('/comments',commentController.fetchAllcomments)
module.exports = router;