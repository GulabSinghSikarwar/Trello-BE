const mongoose = require('mongoose');
const Comment = require('../../models/Comment'); // Adjust the path as necessary
const {logger} =require('../../services/logger')

const migrateComments = async () => {
  const defaultProfilePicture = 'https://example.com/default-profile-picture.jpg'; // New default URL

  try {
    const comments = await Comment.find();
    logger.info("Comments fetched: ", comments);

    for (const comment of comments) {
      logger.info("Processing comment:", comment._id); // Log comment ID or a unique identifier

      // Add default values for new fields if they don't exist
      if (!comment.profilePicture || comment.profilePicture === 'https://flowbite.com/docs/images/people/profile-picture-2.jpg') {
        comment.profilePicture = defaultProfilePicture; // Set new default profile picture URL
      }
      if (!Array.isArray(comment.replies)) {
        comment.replies = [];
      }

      // Save the updated comment and log
      try {
        await comment.save();
        logger.info("Comment migrated:", comment._id);
      } catch (saveError) {
        logger.error("Error saving comment:", comment._id, saveError);
      }
    }

    logger.info("Comment migrations completed.");
  } catch (error) {
    logger.error("Error during comment migration:", error);
  } finally {
     // Ensure disconnection
  }
};

module.exports = migrateComments;
