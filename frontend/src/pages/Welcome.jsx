import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { 
  PlaySquare, 
  MessageSquare, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  Flame, 
  ShieldCheck, 
  Video 
} from "lucide-react"

export default function Welcome() {
  const { user, loading } = useAuth()

  // Automatically redirect authenticated users directly to the feed
  if (!loading && user) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden select-none">
      {/* Subtle Background Ambient Neutral Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-white/[0.03] blur-3xl pointer-events-none rounded-full" />

      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/image.png" 
            alt="EveryTube" 
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 text-white transition-all duration-200"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-16 text-center max-w-4xl mx-auto">
        {/* Monochrome Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-zinc-300 text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4 text-white" />
          <span>Next-Generation Video & Social Community</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
          Where Videos Meet <br className="hidden sm:inline" />
          <span>Live Conversations</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Watch trending creators, stream video content, and participate in community tweets — all under one unified roof.
        </p>

        {/* Primary Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA: Sign In / Sign Up */}
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold text-base rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 group active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign In / Sign Up</span>
          </Link>

          {/* Secondary CTA: Explore as Guest */}
          <Link
            to="/home"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white backdrop-blur-md font-semibold text-base rounded-full border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 group active:scale-[0.98]"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-left">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
              <PlaySquare className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">Rich Video Feeds</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explore curated recommendations and creator uploads with high-definition playback.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">Community Tweets</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interact with discussions, reply in threads, and react to creator thoughts on the fly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300 group">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">Instant Guest Mode</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No login wall required to browse. Watch, explore, and dive in before signing up.
            </p>
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
