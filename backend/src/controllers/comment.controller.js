import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    // Convert page/limit to numbers for calculation
    const skip = (Number(page) - 1) * Number(limit);

    const commentsAggregate = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            // Join with users to get commenter details
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails"
        },
        {
            // Join with likes to get like counts
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: userId ? {
                    $cond: {
                        if: { $in: [userId, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                } : false,
                owner: {
                    userName: "$ownerDetails.userName",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar",
                    _id: "$ownerDetails._id"
                }
            }
        },
        {
            $project: {
                content: 1, 
                createdAt: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        },
        { $sort: { createdAt: -1 } }, // Newest comments first
        { $skip: skip },
        { $limit: Number(limit) }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, commentsAggregate, "Comments fetched successfully"));
});

const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    const commentsAggregate = await Comment.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails"
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: userId ? {
                    $cond: {
                        if: { $in: [userId, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                } : false,
                owner: {
                    userName: "$ownerDetails.userName",
                    fullName: "$ownerDetails.fullName",
                    avatar: "$ownerDetails.avatar",
                    _id: "$ownerDetails._id"
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                parentComment: 1,
                tweet: 1
            }
        },
        { $sort: { createdAt: 1 } } // Oldest first for conversational thread
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, commentsAggregate, "Tweet comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment, please try again");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const addTweetComment = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content, parentComment } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (parentComment && !isValidObjectId(parentComment)) {
        throw new ApiError(400, "Invalid parent comment ID");
    }

    const comment = await Comment.create({
        content: content.trim(),
        tweet: tweetId,
        parentComment: parentComment || null,
        owner: req.user?._id
    });

    const populatedComment = await Comment.findById(comment._id).populate(
        "owner",
        "userName fullName avatar _id"
    );

    const commentData = {
        _id: populatedComment._id,
        content: populatedComment.content,
        tweet: populatedComment.tweet,
        parentComment: populatedComment.parentComment,
        owner: populatedComment.owner,
        createdAt: populatedComment.createdAt,
        updatedAt: populatedComment.updatedAt,
        likesCount: 0,
        isLiked: false
    };

    return res
        .status(201)
        .json(new ApiResponse(201, commentData, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    if (!content) {
        throw new ApiError(400, "Content is required to update comment");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Access Control: Check if the person updating is the owner
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to edit this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { content }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Access Control: Only owner can delete
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this comment");
    }

    // Delete the comment and cascade any direct replies to it
    await Comment.deleteMany({
        $or: [
            { _id: commentId },
            { parentComment: commentId }
        ]
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { commentId }, "Comment deleted successfully"));
});

export {
    getVideoComments,
    getTweetComments,
    addComment,
    addTweetComment,
    updateComment,
    deleteComment
}
