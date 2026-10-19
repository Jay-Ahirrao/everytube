import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UploadCloud } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!avatar) {
      setError("Avatar is required")
      setIsLoading(false)
      return
    }

    const data = new FormData()
    const cleanHandle = formData.userName.replace(/^@/, '').trim().toLowerCase()
    data.append('fullName', formData.fullName.trim())
    data.append('email', formData.email.trim())
    data.append('userName', cleanHandle)
    data.append('password', formData.password)
    data.append('avatar', avatar)
    if (coverImage) {
      data.append('coverImage', coverImage)
    }

    try {
      await register(data)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative px-4 py-12 overflow-hidden select-none">
      {/* Ambient neutral glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-lg p-8 sm:p-10 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create an account</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">Join EveryTube today</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="Joe Schmoe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Handle</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-zinc-500 font-medium select-none text-sm pointer-events-none">@</span>
              <input
                type="text"
                name="userName"
                value={formData.userName.replace(/^@/, '')}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value.replace(/^@/, '').toLowerCase() })}
                className="w-full pl-8 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
                placeholder="handle"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Avatar *</label>
            <div 
              className="border-2 border-dashed border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all group"
              onClick={() => avatarInputRef.current?.click()}
            >
              <UploadCloud className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors mb-1.5" />
              <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors text-center">
                {avatar ? avatar.name : 'Click to upload avatar'}
              </span>
              <input 
                type="file" 
                ref={avatarInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setAvatar(e.target.files[0])}
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Cover Image (Optional)</label>
            <div 
              className="border-2 border-dashed border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all group"
              onClick={() => coverInputRef.current?.click()}
            >
              <UploadCloud className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors mb-1.5" />
              <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors text-center">
                {coverImage ? coverImage.name : 'Click to upload cover image'}
              </span>
              <input 
                type="file" 
                ref={coverInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setCoverImage(e.target.files[0])}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-6 cursor-pointer shadow-lg text-sm"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
