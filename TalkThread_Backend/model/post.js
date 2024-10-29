
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User ID
    post: {
        data: { type: String, required: true }, // Image data as Base64
        contentType: { type: String, required: true } // Content type (e.g., image/jpeg)
    },
    name: { type: String, required: true }, // User name
    email: { type: String, required: true }, // User email
    caption: { type: String, maxlength: 50 }, // Caption with a max length of 50
}, { timestamps: true });


const Post= mongoose.model('Post', postSchema);
module.exports=Post;

