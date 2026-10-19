import { Router } from 'express';
import {
    addComment,
    addTweetComment,
    deleteComment,
    getTweetComments,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Tweet comment routes (placed before /:videoId)
router.route("/t/:tweetId").get(optionalVerifyJWT, getTweetComments);
router.route("/t/:tweetId").post(verifyJWT, addTweetComment);

// Video comment routes
// Public / Guest accessible with optional auth
router.route("/:videoId").get(optionalVerifyJWT, getVideoComments);

// Protected routes requiring authentication
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/c/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment);

export default router;