import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public / Guest accessible with optional auth
router.route("/c/:channelId").get(optionalVerifyJWT, getUserChannelSubscribers);

// Protected routes requiring authentication
router.route("/c/:channelId").post(verifyJWT, toggleSubscription);
router.route("/u/:subscriberId").get(verifyJWT, getSubscribedChannels);

export default router;