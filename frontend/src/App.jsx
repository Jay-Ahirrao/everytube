import { Routes, Route, Navigate } from "react-router-dom"
import RootLayout from "./components/layout/RootLayout"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import Welcome from "./pages/Welcome"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoDetail from "./pages/VideoDetail"
import UploadVideo from "./pages/UploadVideo"
import Tweet from "./pages/Tweet"
import Library from "./pages/Library"
import Profile from "./pages/Profile"
import Subscriptions from "./pages/Subscriptions"
import Channel from "./pages/Channel"
import Explore from "./pages/Explore"
import History from "./pages/History"
import Tweets from "./pages/Tweets"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  return (
    <Routes>
      {/* Root Welcome / Landing Page */}
      <Route path="/" element={<Welcome />} />

      {/* Standalone Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Main Application with Sidebar & Topbar Layout */}
      <Route element={<RootLayout />}>
        {/* Public Feeds & Guest Accessible Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/feed" element={<Navigate to="/home" replace />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/tweets" element={<Tweets />} />
        <Route path="/watch/:videoId" element={<VideoDetail />} />
        <Route path="/channel/:username" element={<Channel />} />

        {/* Protected Member Routes */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tweet"
          element={
            <ProtectedRoute>
              <Tweet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
