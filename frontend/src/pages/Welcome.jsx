import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { 
  Video, 
  MessageSquare, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  Play, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Radio, 
  TrendingUp, 
  Users 
} from "lucide-react"

export default function Welcome() {
  const { user, loading } = useAuth()

  // Automatically redirect authenticated users directly to the feed
  if (!loading && user) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Subtle Warm Brownish-Golden Glow (Centered strictly behind hero text, smoothly fading to black) */}
      <div 
        className="pointer-events-none absolute top-[24%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[360px] rounded-full blur-[140px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, #c68a2c 0%, #8c5b16 50%, transparent 80%)'
        }}
      />

      {/* Subtle Radial Grid Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/image.png" 
            alt="EveryTube" 
            className="h-8 md:h-9 w-auto object-contain" 
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 text-white transition-colors duration-200"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-16 text-center max-w-5xl mx-auto">
        {/* Subtle Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] text-amber-200/90 text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>The Next-Generation Hybrid Media Network</span>
        </div>

        {/* Hero Title with Distinctive Warm Champagne Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl">
          Where Creator Videos Meet <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Real-Time Discourse
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Watch high-definition videos from rising creators, participate in live tweet discussions, and publish your own thoughts — all in one unified, unthrottled feed.
        </p>

        {/* Professional Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: Sign In / Sign Up */}
          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm sm:text-base rounded-full shadow-[0_4px_24px_rgba(255,255,255,0.18)] transition-colors duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In / Sign Up</span>
          </Link>

          {/* Secondary CTA: Continue as Guest (Clear, distinct, professional warm accent) */}
          <Link
            to="/home"
            className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base rounded-full border border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(198,138,44,0.12)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="h-4 w-4 text-amber-300" />
          </Link>
        </div>

        {/* Live Product Preview Showcase: Giving Life and Personality to EveryTube */}
        <div className="mt-16 w-full max-w-4xl rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] text-left">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 text-xs font-medium text-zinc-400">everytube.app/feed</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
              <Radio className="h-3 w-3 animate-pulse text-amber-400" />
              <span>Live Hybrid Stream</span>
            </div>
          </div>

          {/* Showcase Grid: Video on Left, Real-Time Tweets on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Mock Video Player (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between bg-zinc-950/70 border border-white/10 rounded-xl overflow-hidden p-3.5">
              {/* Simulated Video Viewport */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-800 to-amber-950/30 flex items-center justify-center border border-white/10">
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
                
                {/* Center Play Button */}
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-medium text-zinc-200 border border-white/10">
                  14:32 • 4K
                </span>
                
                {/* Live Pill */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-red-500/90 text-[10px] font-semibold text-white tracking-wide uppercase">
                  Featured
                </span>
              </div>

              {/* Video Info Row */}
              <div className="mt-3">
                <h2 className="text-sm font-semibold text-white line-clamp-1">
                  How We Built EveryTube: Merging Creator Videos with Social Discourse
                </h2>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-[10px]">
                      ET
                    </div>
                    <span className="font-medium text-zinc-300 flex items-center gap-1">
                      EveryTube Originals
                      <CheckCircle2 className="h-3 w-3 text-amber-400 inline" />
                    </span>
                  </div>
                  <span className="text-zinc-500">48.2K views • 2h ago</span>
                </div>
              </div>
            </div>

            {/* Right Mock Live Tweets Feed (5 Cols) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                  Live Community Tweets
                </span>
                <span className="text-[11px] text-zinc-500 font-normal">Real-time</span>
              </div>

              {/* Simulated Tweet 1 */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-[9px]">
                      A
                    </div>
                    <span className="font-semibold text-zinc-200">@alex_creates</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">12m</span>
                </div>
                <p className="mt-1.5 text-zinc-300 text-[11px] leading-relaxed">
                  Watching discussions unfold live next to the video is so much better than static comment sections 🔥
                </p>
                <div className="mt-2 flex items-center gap-4 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Heart className="h-3 w-3 text-red-400 fill-red-400/20" /> 184
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> 23 replies
                  </span>
                </div>
              </div>

              {/* Simulated Tweet 2 */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-[9px]">
                      S
                    </div>
                    <span className="font-semibold text-zinc-200">@sarah_dev</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">34m</span>
                </div>
                <p className="mt-1.5 text-zinc-300 text-[11px] leading-relaxed">
                  First video upload live! No gatekept subscriber thresholds to get started. Clean platform.
                </p>
                <div className="mt-2 flex items-center gap-4 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Heart className="h-3 w-3 text-red-400 fill-red-400/20" /> 92
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> 11 replies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator & Platform Engagement Features (Static, No Transitions) */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-left">
          {/* Feature 1: Creator-First Studio */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <Video className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-2 tracking-tight">Creator Video Studio</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
              Publish in full clarity with customized thumbnails and rich tags. Grow and own your dedicated subscriber base from day one.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 text-[10px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">HD Video Uploads</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Custom Thumbnails</span>
            </div>
          </div>

          {/* Feature 2: Community & Live Tweets */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-2 tracking-tight">Integrated Social Feed</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
              Don't just watch videos. Post thoughts, join tweet threads, react to creators, and engage directly with fellow fans.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 text-[10px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Threaded Tweets</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Instant Reactions</span>
            </div>
          </div>

          {/* Feature 3: Organic Discovery */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <Flame className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-2 tracking-tight">Organic Creator Reach</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
              A transparent feed designed for discovery. New creators get real visibility without paywalls or restrictive algorithm barriers.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 text-[10px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Zero Gatekeeping</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Instant Guest Pass</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <p>© {new Date().getFullYear()} EveryTube. The Hybrid Media Network.</p>
        <div className="flex items-center gap-6">
          <Link to="/home" className="hover:text-white transition-colors">Feed</Link>
          <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link to="/tweets" className="hover:text-white transition-colors">Tweets</Link>
          <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
        </div>
      </footer>
    </div>
  )
}
