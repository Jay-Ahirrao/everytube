import { useState, useEffect } from "react"
import { api } from "../lib/axios"
import VideoCard from "../components/ui/VideoCard"
import { Compass, Loader2, TrendingUp, Clock, Eye } from "lucide-react"
import { cn } from "../lib/utils"

const FILTER_OPTIONS = [
  { id: "newest", label: "Newest", icon: Clock, sortBy: "createdAt" },
  { id: "most_viewed", label: "Most Viewed", icon: Eye, sortBy: "views" },
  { id: "trending", label: "Trending", icon: TrendingUp, sortBy: "trending" },
]

export default function Explore() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("newest")

  const fetchVideos = async (filterId) => {
    try {
      setLoading(true)
      const selected = FILTER_OPTIONS.find((opt) => opt.id === filterId) || FILTER_OPTIONS[0]
      const sortParam = selected.sortBy === "trending" ? "views" : selected.sortBy
      const { data } = await api.get(`/videos?sortBy=${sortParam}&sortType=desc`)
      const videosData = data.data
      setVideos(videosData?.videos || videosData?.docs || (Array.isArray(videosData) ? videosData : []))
    } catch (error) {
      console.error("Failed to fetch explore videos", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos(activeFilter)
  }, [activeFilter])

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Explore</h1>
            <p className="text-sm text-muted-foreground">Discover the most popular and recent videos</p>
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
      ) : videos.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/20">
          <Compass className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-primary">No videos found</h3>
          <p className="text-muted-foreground mt-2">Check back later for fresh content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
