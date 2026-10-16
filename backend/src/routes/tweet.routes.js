import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public / Guest accessible with optional auth
router.route("/").get(optionalVerifyJWT, getAllTweets);
router.route("/user/:userId").get(optionalVerifyJWT, getUserTweets);

// Protected routes requiring authentication
router.route("/").post(verifyJWT, createTweet);
router.route("/:tweetId").patch(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet);

export default router;