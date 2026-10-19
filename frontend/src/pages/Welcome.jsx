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
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm sm:text-base rounded-full shadow-[0_4px_24px_rgba(255,255,255,0.18)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.25)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign In / Sign Up</span>
          </Link>

          {/* Secondary CTA: Explore as Guest */}
          <Link
            to="/home"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-white backdrop-blur-2xl font-semibold text-sm sm:text-base rounded-full border border-white/[0.18] hover:border-white/[0.32] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Feature Highlights Grid with Rich Glassmorphism */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-left">
          {/* Feature 1 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] hover:border-white/[0.25] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-white/[0.08] border border-white/[0.15] backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:scale-105 group-hover:bg-white/[0.12] transition-transform">
              <PlaySquare className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 tracking-tight">Rich Video Feeds</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Explore curated recommendations and creator uploads with high-definition playback.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] hover:border-white/[0.25] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-white/[0.08] border border-white/[0.15] backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:scale-105 group-hover:bg-white/[0.12] transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 tracking-tight">Community Tweets</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Interact with discussions, reply in threads, and react to creator thoughts on the fly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.12] hover:border-white/[0.25] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="h-11 w-11 rounded-xl bg-white/[0.08] border border-white/[0.15] backdrop-blur-md flex items-center justify-center text-white mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:scale-105 group-hover:bg-white/[0.12] transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 tracking-tight">Instant Guest Mode</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
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
