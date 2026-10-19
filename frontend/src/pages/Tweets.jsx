import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { api } from "../lib/axios"
import TweetCard from "../components/ui/TweetCard"
import { MessageSquare, Loader2, Clock, Heart, ArrowLeft } from "lucide-react"
import { cn } from "../lib/utils"

const FILTER_OPTIONS = [
  { id: "newest", label: "Newest", icon: Clock, sortBy: "createdAt" },
  { id: "most_liked", label: "Most Liked", icon: Heart, sortBy: "likes" },
]

export default function Tweets() {
  const [searchParams] = useSearchParams()
  const targetTweetId = searchParams.get("tweetId")
  const shouldOpenComments = searchParams.get("openComments") === "true"
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("newest")

  const fetchTweets = async (filterId) => {
    try {
      setLoading(true)
      const selected = FILTER_OPTIONS.find((opt) => opt.id === filterId) || FILTER_OPTIONS[0]
      const { data } = await api.get(`/tweets?sortBy=${selected.sortBy}&sortType=desc`)
      setTweets(data.data || [])
    } catch (error) {
      console.error("Failed to fetch tweets", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTweets(activeFilter)
  }, [activeFilter])

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="p-2 bg-secondary/60 hover:bg-secondary rounded-xl text-zinc-300 hover:text-white border border-border transition-colors flex items-center justify-center shrink-0 shadow-sm"
            title="Back to Home feed"
            aria-label="Back to Home feed"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Tweets</h1>
            <p className="text-sm text-muted-foreground">Join the conversation with the community</p>
          </div>
        </div>

        {/* Filter / Sort Toggle Buttons */}
        <div className="flex items-center gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.id
            return (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-white text-black border border-white shadow-sm"
                    : "bg-secondary/40 border border-white/10 text-zinc-300 hover:bg-secondary hover:text-white"
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/20">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-primary">No tweets found</h3>
          <p className="text-muted-foreground mt-2">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              isDashboard={false}
              isHighlighted={tweet._id === targetTweetId}
              initialOpenComments={tweet._id === targetTweetId && shouldOpenComments}
            />
          ))}
        </div>
      )}
    </div>
  )
}
