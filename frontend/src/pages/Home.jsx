import { useState, useEffect } from "react"
import { api } from "../lib/axios"
import VideoCard from "../components/ui/VideoCard"
import TweetCard from "../components/ui/TweetCard"
import { PlaySquare, MessageSquare, Loader2, Sparkles, LogIn } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch public videos and community tweets regardless of authentication status
        const [videosRes, tweetsRes] = await Promise.all([
          api.get("/videos").catch((err) => {
            console.error("Failed to fetch videos", err)
            return { data: { data: [] } }
          }),
          api.get("/tweets?sortBy=createdAt&sortType=desc").catch((err) => {
            console.error("Failed to fetch tweets", err)
            return { data: { data: [] } }
          }),
        ])

        if (!isMounted) return

        const videosData = videosRes.data?.data
        setVideos(
          videosData?.videos ||
            videosData?.docs ||
            (Array.isArray(videosData) ? videosData : [])
        )

        const tweetsData = tweetsRes.data?.data
        setTweets(Array.isArray(tweetsData) ? tweetsData : [])
      } catch (error) {
        console.error("Failed to fetch home feed", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Guest Mode Informational Banner (YouTube-style, non-intrusive) */}
      {!user && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Browsing in Guest Mode
              </p>
              <p className="text-xs text-muted-foreground">
                Enjoy public feeds anytime. Sign in to subscribe, like, comment, and upload.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="shrink-0 px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 shadow"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Top Tweets Section (Twitter vibe) */}
      {tweets.length > 0 && (
        <>
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-xl font-bold tracking-tight">Community Tweets</h2>
              </div>
              <Link
                to="/tweets"
                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
              {tweets.slice(0, 8).map((tweet) => (
                <div key={tweet._id} className="min-w-[300px] md:min-w-[380px] snap-start">
                  <TweetCard tweet={tweet} />
                </div>
              ))}
            </div>
          </section>
          <hr className="border-border/60" />
        </>
      )}

      {/* Video Feed Section (YouTube vibe) */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-primary">
          <PlaySquare className="h-5 w-5" />
          <h2 className="text-xl font-bold tracking-tight">Recommended Videos</h2>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-secondary/10">
            <PlaySquare className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-primary">No videos available yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Check back soon or sign in to upload your own video!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
