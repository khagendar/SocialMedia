const PostModel = require("../model/post"); // Import the Post model with a unique name

class PostController {
    async Createpost(req, res) {
        try {
            const { userId, name, email, caption } = req.body;

            // Convert image buffer to Base64 string
            const base64Image = req.file.buffer.toString('base64');

            // Create a new instance of PostModel
            const newPost = new PostModel({
                userId,
                post: {
                    data: base64Image,
                    contentType: req.file.mimetype 
                },
                name,
                email,
                caption,
            });

            await newPost.save();
            res.status(201).json({ message: 'Post created successfully', post: newPost });
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error });
        }
    }
}

module.exports = new PostController();
