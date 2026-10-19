import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/axios'
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)
    try {
      const response = await api.post('/users/forgot-password', { email })
      setMessage(response.data?.message || 'OTP sent successfully to your email.')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)
    try {
      await api.post('/users/verify-otp', { email, otp })
      setMessage('OTP verified successfully! Now choose your new password.')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/users/reset-password', { email, otp, newPassword })
      setMessage(response.data?.message || 'Password reset successfully!')
      setStep(4) // Success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please request a new OTP.')
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

      <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-950/75 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">
            {step === 1 && 'Enter your email address to receive a password reset code.'}
            {step === 2 && 'Enter the 6-digit OTP code sent to your registered email.'}
            {step === 3 && 'Choose a strong, secure new password.'}
            {step === 4 && 'Your password has been successfully updated.'}
          </p>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center mb-8 gap-2">
            <span className={`w-8 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-white' : 'bg-white/20'}`} />
            <span className={`w-8 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
            <span className={`w-8 h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && step !== 4 && (
          <div className="mb-6 p-3.5 bg-white/10 border border-white/20 rounded-xl text-white text-xs sm:text-sm backdrop-blur-sm text-center">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer shadow-lg text-sm"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Verification Code (OTP)</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 tracking-widest text-center text-lg font-bold focus:border-white focus:ring-1 focus:ring-white outline-none transition-all"
                  placeholder="123456"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer shadow-lg text-sm"
            >
              {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change Email
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer shadow-lg text-sm"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-14 w-14 text-white animate-pulse" />
            <div className="p-4 bg-white/10 border border-white/20 rounded-2xl text-white text-sm backdrop-blur-sm">
              Password changed successfully! You can now log in with your new credentials.
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-colors mt-4 cursor-pointer shadow-lg text-sm"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {step < 4 && (
          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs sm:text-sm text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
