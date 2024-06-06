const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadDestination } = require("../constants");
const { UserController, PostController, CommentController, LikeController, FollowController} = require("../controllers")
const authenticateToken = require("../middleware/auth");

// Show where to store static files
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploads = multer({ storage })

// Users routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, uploads.single('avatar'), UserController.updateUser)

// Posts routes
router.post('/posts', authenticateToken, PostController.createPost)
router.get('/posts', authenticateToken, PostController.getAllPosts)
router.get('/posts/:id', authenticateToken, PostController.getPostById)
router.delete('/posts/:id', authenticateToken, PostController.deletePost)

// Comments routes
router.post('/comments', authenticateToken, CommentController.createComment)
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment)

// Likes routes
router.post('/likes', authenticateToken, LikeController.likePost)
router.delete('/likes/:postId', authenticateToken, LikeController.unlikePost)

// Follow routes
router.post('/follow', authenticateToken, FollowController.followUser)
router.delete('/follow/:following', authenticateToken, FollowController.unfollowUser)

module.exports = router;