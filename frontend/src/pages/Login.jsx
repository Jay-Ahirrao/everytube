import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from || '/home'

  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true })
    }
  }, [user, navigate, destination])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await login({ email, password })
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative px-4 py-12 overflow-hidden select-none">
      {/* Ambient neutral glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">Sign in to your EveryTube account</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer shadow-lg text-sm"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:underline font-medium">
            Register here
          </Link>
        </p>

        <div className="mt-5 border-t border-white/10 pt-4 text-center">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md transition-all shadow-[0_0_12px_rgba(255,255,255,0.08)]"
          >
            <span>Continue as Guest</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
