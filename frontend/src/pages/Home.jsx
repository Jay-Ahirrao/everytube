import { useState, useEffect, useRef } from "react"
import { api } from "../lib/axios"
import VideoCard from "../components/ui/VideoCard"
import TweetCard from "../components/ui/TweetCard"
import { PlaySquare, MessageSquare, Loader2, Info, X, LogIn, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGuestBanner, setShowGuestBanner] = useState(() => {
    return !sessionStorage.getItem("hide_guest_banner")
  })

  // Carousel ref and scroll state
  const tweetsCarouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkCarouselScroll = () => {
    if (tweetsCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tweetsCarouselRef.current
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }

  useEffect(() => {
    checkCarouselScroll()
    const el = tweetsCarouselRef.current
    if (el) {
      el.addEventListener("scroll", checkCarouselScroll, { passive: true })
      window.addEventListener("resize", checkCarouselScroll)
      return () => {
        el.removeEventListener("scroll", checkCarouselScroll)
        window.removeEventListener("resize", checkCarouselScroll)
      }
    }
  }, [tweets])

  const scrollCarousel = (direction) => {
    if (!tweetsCarouselRef.current) return
    const el = tweetsCarouselRef.current
    const cardEl = el.querySelector(".snap-start")
    const cardWidth = cardEl ? cardEl.offsetWidth + 16 : 380
    const targetLeft =
      direction === "left"
        ? Math.max(0, el.scrollLeft - cardWidth)
        : Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + cardWidth)

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    })

    setTimeout(checkCarouselScroll, 350)
  }

  const dismissGuestBanner = () => {
    sessionStorage.setItem("hide_guest_banner", "true")
    setShowGuestBanner(false)
  }

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
      {/* Simplified Guest Notification Banner */}
      {!user && showGuestBanner && (
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-border text-xs shadow-sm transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Info className="h-4 w-4" />
            </div>
            <p className="text-zinc-300 truncate">
              <span className="font-semibold text-white">Browsing as Guest</span>
              <span className="hidden sm:inline text-muted-foreground ml-1.5">
                — Sign in to subscribe, like, comment, and upload.
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="px-3 py-1 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm text-xs"
            >
              <LogIn className="h-3 w-3" />
              <span>Sign In</span>
            </Link>
            <button
              onClick={dismissGuestBanner}
              className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss guest notice"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Tweets Section (Twitter vibe) */}
      {tweets.length > 0 && (
        <>
          <section className="relative">
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

            {/* Carousel Container with Floating Edge Arrows */}
            <div className="relative group/carousel">
              {/* Floating Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCarousel("left")}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-zinc-950/95 border border-white/20 text-white shadow-2xl items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Previous tweet"
                  title="Previous tweet"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {/* Scrollable Tweets Container */}
              <div
                ref={tweetsCarouselRef}
                className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x items-stretch"
              >
                {tweets.slice(0, 10).map((tweet) => (
                  <div key={tweet._id} className="min-w-[300px] md:min-w-[360px] max-w-[380px] snap-start flex shrink-0">
                    <TweetCard tweet={tweet} isDashboard={true} />
                  </div>
                ))}
              </div>

              {/* Floating Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollCarousel("right")}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-zinc-950/95 border border-white/20 text-white shadow-2xl items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Next tweet"
                  title="Next tweet"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
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
