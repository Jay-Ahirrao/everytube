import { Heart, MessageCircle, Repeat2, Share, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../lib/axios"
import { useAuth } from "../../context/AuthContext"
import TweetComments from "./TweetComments"

export default function TweetCard({
  tweet,
  isDashboard = false,
  isHighlighted = false,
  initialOpenComments = false,
}) {
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const textRef = useRef(null)

  const [likesCount, setLikesCount] = useState(tweet.likesCount || 0)
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount || 0)
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false)
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [isExpanded, setIsExpanded] = useState(isHighlighted)
  const [highlighted, setHighlighted] = useState(isHighlighted)
  const [showComments, setShowComments] = useState(initialOpenComments)
  const [isLongContent, setIsLongContent] = useState(false)

  // Scroll to highlighted tweet if navigated from dashboard & auto-remove highlight after 2s
  useEffect(() => {
    if (isHighlighted) {
      setHighlighted(true)
      setIsExpanded(true)
      if (initialOpenComments) {
        setShowComments(true)
      }
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      const timer = setTimeout(() => {
        setHighlighted(false)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setHighlighted(false)
    }
  }, [isHighlighted, initialOpenComments])

  // Check if content exceeds 3 lines
  useEffect(() => {
    const rawContent = tweet.content || ""
    const lineCount = (rawContent.match(/\n/g) || []).length + 1
    if (lineCount > 3 || rawContent.length > 130) {
      setIsLongContent(true)
    } else if (textRef.current) {
      setIsLongContent(textRef.current.scrollHeight > textRef.current.clientHeight + 4)
    }
  }, [tweet.content])

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
    return Math.floor(seconds) + "s"
  }

  const handleToggleLike = async (e) => {
    e.stopPropagation()
    if (!user) {
      openAuthModal({
        title: "Like this tweet?",
        message: "Sign in to like tweets, join discussions, and interact with creators.",
        redirectTo: window.location.pathname || "/home",
      })
      return
    }
    if (isTogglingLike) return

    try {
      setIsTogglingLike(true)
      const { data } = await api.post(`/likes/toggle/t/${tweet._id}`)
      const nowLiked = data.data.isLiked
      setIsLiked(nowLiked)
      setLikesCount((prev) => (nowLiked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Failed to toggle tweet like", error)
    } finally {
      setIsTogglingLike(false)
    }
  }

  const handleCardClick = () => {
    if (isDashboard) {
      navigate(`/tweets?tweetId=${tweet._id}`)
    }
  }

  const handleReadMoreClick = (e) => {
    e.stopPropagation()
    if (isDashboard) {
      // In home dashboard: open the full tweet in the tweets page itself
      navigate(`/tweets?tweetId=${tweet._id}`)
    } else {
      // On the tweets page: expand inline
      setIsExpanded(true)
    }
  }

  const handleShowLessClick = (e) => {
    e.stopPropagation()
    setIsExpanded(false)
  }

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`flex gap-3 p-4 bg-card border rounded-xl hover:bg-secondary/40 transition-all duration-700 cursor-pointer w-full group/card ${
        highlighted
          ? "border-primary ring-2 ring-primary/40 bg-primary/[0.05] shadow-lg shadow-primary/10"
          : "border-border"
      } ${
        isDashboard
          ? "h-[190px] flex-col justify-between"
          : "flex-col sm:flex-row items-start"
      }`}
    >
      <div className="flex gap-3 w-full min-w-0">
        {/* Author Avatar */}
        <div className="h-9 w-9 rounded-full overflow-hidden bg-secondary shrink-0 mt-0.5">
          {tweet.owner?.avatar ? (
            <img
              src={tweet.owner.avatar}
              alt={tweet.owner?.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-primary/20 text-primary">
              {(tweet.owner?.userName?.[0] || tweet.owner?.fullName?.[0] || "U").toUpperCase()}
            </div>
          )}
        </div>

        {/* Tweet Main Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-1">
            <span className="font-bold text-primary hover:underline truncate">
              {tweet.owner?.fullName || tweet.owner?.userName || "Unknown User"}
            </span>
            <span className="text-muted-foreground truncate">
              @{tweet.owner?.userName || "unknown"}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">
              {formatTimeAgo(tweet.createdAt)}
            </span>
          </div>

          {/* Text Body with Read More */}
          <div className="text-xs sm:text-sm text-foreground leading-relaxed">
            <p
              ref={textRef}
              className={`whitespace-pre-wrap break-words ${
                isDashboard || !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              {tweet.content}
            </p>

            {isLongContent && (
              <>
                {(isDashboard || !isExpanded) ? (
                  <button
                    type="button"
                    onClick={handleReadMoreClick}
                    className="text-xs font-semibold text-primary hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Read more &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleShowLessClick}
                    className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tweet Engagement Actions */}
      <div
        className={`flex items-center justify-between text-muted-foreground w-full ${
          isDashboard ? "pt-2 border-t border-border/40" : "max-w-md pt-2 pl-0 sm:pl-12"
        }`}
      >
        <button
          className={`flex items-center gap-1.5 group transition-colors p-1 cursor-pointer ${
            showComments ? "text-blue-400 font-semibold" : "hover:text-blue-400"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            if (isDashboard) {
              navigate(`/tweets?tweetId=${tweet._id}&openComments=true`)
            } else {
              setShowComments((prev) => !prev)
            }
          }}
          title={isDashboard ? "View replies" : showComments ? "Hide replies" : "View replies"}
        >
          <div
            className={`p-1 rounded-full group-hover:bg-blue-400/10 transition-colors ${
              showComments ? "bg-blue-400/10" : ""
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs">{commentsCount}</span>
        </button>

        <button
          className="flex items-center gap-1.5 group hover:text-green-400 transition-colors p-1"
          onClick={(e) => e.stopPropagation()}
          title="Repost"
        >
          <div className="p-1 rounded-full group-hover:bg-green-400/10 transition-colors">
            <Repeat2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs">0</span>
        </button>

        <button
          className={`flex items-center gap-1.5 group transition-colors p-1 ${
            isLiked ? "text-red-500" : "hover:text-red-500"
          }`}
          onClick={handleToggleLike}
          disabled={isTogglingLike}
          title={isLiked ? "Unlike" : "Like"}
        >
          <div className="p-1 rounded-full group-hover:bg-red-500/10 transition-colors">
            {isTogglingLike ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
            )}
          </div>
          <span className="text-xs font-bold">{likesCount}</span>
        </button>

        <button
          className="flex items-center gap-1.5 group hover:text-blue-400 transition-colors p-1"
          onClick={(e) => {
            e.stopPropagation()
            if (navigator.clipboard) {
              navigator.clipboard.writeText(`${window.location.origin}/tweets?tweetId=${tweet._id}`)
            }
          }}
          title="Share tweet link"
        >
          <div className="p-1 rounded-full group-hover:bg-blue-400/10 transition-colors">
            <Share className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>

      {/* Threaded Comments & Replies Drawer */}
      {!isDashboard && showComments && (
        <TweetComments
          tweetId={tweet._id}
          tweetOwnerUsername={tweet.owner?.userName}
          onCommentsCountChange={setCommentsCount}
        />
      )}
    </div>
  )
}
