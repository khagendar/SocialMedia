const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PostController = require('../controllers/post');

// Create Post endpoint
router.post('/Createposts', upload.single('image'), PostController.Createpost);

module.exports = router;
