const mongoose = require('mongoose');
const Reply = require('../../models/Reply'); // Adjust the path as necessary
const {logger} =require('../../services/logger')

const migrateReplies = async () => {
  const defaultProfilePicture = 'https://example.com/default-profile-picture.jpg'; // New default URL

  try {
    const replies = await Reply.find();
    logger.info("Replies fetched: ", replies);

    for (const reply of replies) {
      logger.info("Processing reply:", reply._id); // Log reply ID or a unique identifier

      // Add default values for new fields if they don't exist
      if (!reply.author) {
        reply.author = 'Unknown Author'; // Provide a default value
      }
      if (!reply.profilePicture || reply.profilePicture === 'https://flowbite.com/docs/images/people/profile-picture-2.jpg') {
        reply.profilePicture = defaultProfilePicture; // Set new default profile picture URL
      }

      // Save the updated reply and log
      try {
        await reply.save();
        logger.info("Reply migrated:", reply._id);
      } catch (saveError) {
        logger.error("Error saving reply:", reply._id, saveError);
      }
    }

    logger.info("Reply migrations completed.");
  } catch (error) {
    logger.error("Error during reply migration:", error);
  } finally {
    mongoose.disconnect(); // Ensure disconnection
  }
};

module.exports = migrateReplies;
