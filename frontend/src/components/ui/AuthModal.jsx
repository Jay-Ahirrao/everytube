import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { X, LogIn, Sparkles, UserPlus } from "lucide-react"

export default function AuthModal() {
  const { authModal, closeAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModal?.isOpen) {
        closeAuthModal()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [authModal?.isOpen, closeAuthModal])

  if (!authModal?.isOpen) return null

  const handleSignIn = () => {
    const redirect = authModal.redirectTo || "/home"
    closeAuthModal()
    navigate("/login", { state: { from: redirect } })
  }

  const handleSignUp = () => {
    closeAuthModal()
    navigate("/register")
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        

        {/* Title & Message */}
        <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {authModal.title || "Sign in to EveryTube"}
        </h3>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed px-2">
          {authModal.message || "Join our community to subscribe, like, comment, and upload videos and tweets."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-5 bg-white text-black hover:bg-zinc-200 font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={handleSignUp}
            className="w-full py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/20 backdrop-blur-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Account</span>
          </button>

          <button
            onClick={closeAuthModal}
            className="mt-1 text-xs text-zinc-400 hover:text-white transition-colors py-1 cursor-pointer"
          >
            Stay in Guest Mode
          </button>
        </div>
      </div>
    </div>
  )
}
