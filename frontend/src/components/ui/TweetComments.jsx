import { useState, useEffect } from "react"
import { api } from "../../lib/axios"
import { useAuth } from "../../context/AuthContext"
import { MessageCircle, Heart, Trash2, CornerDownRight, Loader2, Send, X } from "lucide-react"

export default function TweetComments({ tweetId, tweetOwnerUsername, onCommentsCountChange }) {
  const { user, openAuthModal } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [rootContent, setRootContent] = useState("")
  const [isSubmittingRoot, setIsSubmittingRoot] = useState(false)
  const [replyingToId, setReplyingToId] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const formatTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + "y"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + "mo"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + "d"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + "h"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + "m"
    return Math.max(1, Math.floor(seconds)) + "s"
  }

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/comments/t/${tweetId}`)
      setComments(data.data || [])
    } catch (error) {
      console.error("Failed to fetch tweet comments", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tweetId) {
      fetchComments()
    }
  }, [tweetId])

  const requireAuth = (actionTitle, actionMsg) => {
    if (!user) {
      openAuthModal({
        title: actionTitle || "Want to reply?",
        message: actionMsg || "Sign in to join the conversation and reply to tweets.",
        redirectTo: `/tweets?tweetId=${tweetId}&openComments=true`,
      })
      return false
    }
    return true
  }

  const handleAddRootComment = async (e) => {
    e.preventDefault()
    if (!requireAuth("Reply to this tweet?", "Sign in to add your reply to this tweet.")) return
    if (!rootContent.trim() || isSubmittingRoot) return

    try {
      setIsSubmittingRoot(true)
      const { data } = await api.post(`/comments/t/${tweetId}`, {
        content: rootContent.trim(),
      })
      const newComment = {
        ...data.data,
        owner: data.data.owner || {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          avatar: user.avatar,
        },
        likesCount: 0,
        isLiked: false,
      }
      setComments((prev) => [...prev, newComment])
      setRootContent("")
      if (onCommentsCountChange) {
        onCommentsCountChange((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Failed to post tweet comment", error)
    } finally {
      setIsSubmittingRoot(false)
    }
  }

  const handleAddReply = async (parentCommentId, targetUsername) => {
    if (!requireAuth("Reply to this comment?", `Sign in to reply to @${targetUsername}.`)) return
    if (!replyContent.trim() || isSubmittingReply) return

    try {
      setIsSubmittingReply(true)
      const { data } = await api.post(`/comments/t/${tweetId}`, {
        content: replyContent.trim(),
        parentComment: parentCommentId,
      })
      const newReply = {
        ...data.data,
        owner: data.data.owner || {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          avatar: user.avatar,
        },
        likesCount: 0,
        isLiked: false,
      }
      setComments((prev) => [...prev, newReply])
      setReplyContent("")
      setReplyingToId(null)
      if (onCommentsCountChange) {
        onCommentsCountChange((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Failed to post reply", error)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleToggleCommentLike = async (commentId) => {
    if (!requireAuth("Like this comment?", "Sign in to react to comments.")) return

    try {
      const { data } = await api.post(`/likes/toggle/c/${commentId}`)
      const nowLiked = data.data.isLiked
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              isLiked: nowLiked,
              likesCount: nowLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 1) - 1),
            }
          }
          return c
        })
      )
    } catch (error) {
      console.error("Failed to toggle comment like", error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return
    try {
      await api.delete(`/comments/c/${commentId}`)
      // Remove deleted comment and any direct children
      const remaining = comments.filter((c) => c._id !== commentId && c.parentComment !== commentId)
      const deletedCount = comments.length - remaining.length
      setComments(remaining)
      if (onCommentsCountChange) {
        onCommentsCountChange((prev) => Math.max(0, prev - deletedCount))
      }
    } catch (error) {
      console.error("Failed to delete comment", error)
    }
  }

  // Build recursive threaded comment hierarchy
  const organizeCommentTree = (flatList) => {
    const map = new Map()
    const roots = []

    flatList.forEach((c) => {
      map.set(c._id.toString(), { ...c, replies: [] })
    })

    flatList.forEach((c) => {
      const item = map.get(c._id.toString())
      if (c.parentComment) {
        const parentId =
          typeof c.parentComment === "object"
            ? c.parentComment._id?.toString() || c.parentComment.toString()
            : c.parentComment.toString()
        const parent = map.get(parentId)
        if (parent) {
          parent.replies.push(item)
        } else {
          roots.push(item)
        }
      } else {
        roots.push(item)
      }
    })

    return roots
  }

  const commentTree = organizeCommentTree(comments)

  // Recursive Comment Node Component
  const renderCommentItem = (item, depth = 0) => {
    const isReplyingThis = replyingToId === item._id
    const isAuthor = user?._id && (item.owner?._id === user._id || item.owner === user._id)

    return (
      <div
        key={item._id}
        className={`flex flex-col group/item transition-colors ${
          depth > 0
            ? "ml-3 sm:ml-6 mt-2.5 pl-3 border-l-2 border-border/60"
            : "pt-3 border-t border-border/40 first:border-t-0 first:pt-0"
        }`}
      >
        <div className="flex gap-2.5 items-start">
          {/* Avatar */}
          <div className="h-7 w-7 rounded-full overflow-hidden bg-secondary shrink-0 mt-0.5 border border-border/50">
            {item.owner?.avatar ? (
              <img
                src={item.owner.avatar}
                alt={item.owner?.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold bg-primary/20 text-primary">
                {(item.owner?.userName?.[0] || item.owner?.fullName?.[0] || "U").toUpperCase()}
              </div>
            )}
          </div>

          {/* Comment Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs mb-0.5">
              <span className="font-semibold text-zinc-200 hover:text-white transition-colors truncate">
                {item.owner?.fullName || item.owner?.userName || "Anonymous"}
              </span>
              <span className="text-zinc-400/80 text-[11px] truncate">
                @{item.owner?.userName || "user"}
              </span>
              <span className="text-zinc-600 select-none">•</span>
              <span className="text-[11px] text-zinc-400/80 shrink-0">
                {formatTimeAgo(item.createdAt)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
              {item.content}
            </p>

            {/* Comment Actions: Like, Reply, Delete */}
            <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => handleToggleCommentLike(item._id)}
                className={`flex items-center gap-1 hover:text-red-400 transition-colors p-0.5 cursor-pointer ${
                  item.isLiked ? "text-red-500 font-semibold" : ""
                }`}
                title={item.isLiked ? "Unlike" : "Like reply"}
              >
                <Heart className={`h-3 w-3 ${item.isLiked ? "fill-current" : ""}`} />
                <span className="text-[11px]">{item.likesCount || 0}</span>
              </button>

              {/* Reply Button (Allows replying to anyone's comment) */}
              <button
                type="button"
                onClick={() => {
                  if (requireAuth("Reply to this comment?", `Sign in to reply to @${item.owner?.userName}.`)) {
                    if (isReplyingThis) {
                      setReplyingToId(null)
                      setReplyContent("")
                    } else {
                      setReplyingToId(item._id)
                      setReplyContent("")
                    }
                  }
                }}
                className={`flex items-center gap-1 transition-colors p-0.5 cursor-pointer ${
                  isReplyingThis
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
                title="Reply to this comment"
              >
                <CornerDownRight className="h-3 w-3" />
                <span className="text-[11px]">Reply</span>
              </button>

              {/* Delete Button */}
              {isAuthor && (
                <button
                  type="button"
                  onClick={() => handleDeleteComment(item._id)}
                  className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity p-0.5 cursor-pointer ml-auto"
                  title="Delete reply"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Nested Inline Reply Box */}
            {isReplyingThis && (
              <div className="mt-2.5 p-2.5 bg-secondary/40 border border-primary/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Replying to <span className="text-primary font-medium">@{item.owner?.userName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Write a reply to @${item.owner?.userName}...`}
                  rows={2}
                  autoFocus
                  className="w-full bg-background/60 rounded-lg p-2 text-xs text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary outline-none resize-none transition-colors"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="px-2.5 py-1 text-xs text-muted-foreground hover:text-white rounded-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!replyContent.trim() || isSubmittingReply}
                    onClick={() => handleAddReply(item._id, item.owner?.userName)}
                    className="px-3 py-1 bg-primary text-primary-foreground font-semibold text-xs rounded-full hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {isSubmittingReply && <Loader2 className="h-3 w-3 animate-spin" />}
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recursive Child Replies */}
        {item.replies && item.replies.length > 0 && (
          <div className="flex flex-col">
            {item.replies.map((child) => renderCommentItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full pt-3 mt-3 border-t border-border/50 flex flex-col gap-3"
    >
      {/* Top Level Reply Input */}
      <form onSubmit={handleAddRootComment} className="flex gap-2.5 items-start">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary shrink-0 mt-0.5 border border-border">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/20 text-primary">
              {(user?.userName?.[0] || "U").toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={rootContent}
            onChange={(e) => setRootContent(e.target.value)}
            onFocus={() => requireAuth("Reply to tweet?", "Sign in to post a reply to this tweet.")}
            placeholder={
              tweetOwnerUsername
                ? `Tweet your reply to @${tweetOwnerUsername}...`
                : "Tweet your reply..."
            }
            className="w-full bg-secondary/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 border border-border/80 focus:border-primary outline-none transition-colors"
          />
          {rootContent.trim() && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!rootContent.trim() || isSubmittingRoot}
                className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold text-xs rounded-full hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSubmittingRoot ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                <span>Reply</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List & Nested Threads */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : commentTree.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground/80 italic">
          No replies yet. Be the first to join the conversation!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {commentTree.map((rootComment) => renderCommentItem(rootComment, 0))}
        </div>
      )}
    </div>
  )
}
