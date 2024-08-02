const mongoose = require('mongoose');
const Comment = require('../../models/Comment'); // Adjust the path as necessary
const User = require('../../models/User'); // Ensure the path is correct
const { logger } = require('../../services/logger');

const migrateComments = async () => {
  const defaultProfilePicture = 'https://flowbite.com/docs/images/people/profile-picture-4.jpg'; // New default URL

  try {
    const comments = await Comment.find();
    logger.info("Comments fetched:", comments.length);

    for (const comment of comments) {
      logger.info("Processing comment:", comment._id); // Log comment ID or a unique identifier

      // Add default values for new fields if they don't exist
      if (!comment.profilePicture || comment.profilePicture === 'https://example.com/default-profile-picture.jpg') {
        comment.profilePicture = defaultProfilePicture; // Set new default profile picture URL
      }
      if (!Array.isArray(comment.replies)) {
        comment.replies = [];
      }

      // Fetch the username from the User model and add it to the comment
      if (!comment.username) {
        try {
          const user = await User.findById(comment.userId).select('username');
          if (user) {
            comment.username = user.username;
          } else {
            logger.warn("User not found for comment:", comment._id);
            comment.username = 'Arthur';
          }
        } catch (userError) {
          logger.error("Error fetching user for comment:", comment._id, userError);
          comment.username = 'Arthur';
        }
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
    // await mongoose.disconnect();
    logger.info("Database connection closed.");
  }
};

module.exports = migrateComments;
