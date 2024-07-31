const { Schema, default: mongoose } = require('mongoose')

const replySchema = new Schema({
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    profilePicture: { type: String }
});


const Reply=mongoose.model('Reply',replySchema);
module.exports=Reply