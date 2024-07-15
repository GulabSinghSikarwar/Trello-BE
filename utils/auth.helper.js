const User = require("../models/User");

const updateUser = async (id, updateFields) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // Returns the updated document
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`Unable to update user: ${error.message}`);
    }
};



module.exports = { updateUser }