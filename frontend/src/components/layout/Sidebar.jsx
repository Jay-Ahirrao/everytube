import { NavLink, Link, useNavigate } from "react-router-dom"
import { 
  Home, 
  Compass, 
  PlaySquare, 
  Clock, 
  User, 
  PlusSquare, 
  MessageSquare, 
  Lock 
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { cn } from "../../lib/utils"

const NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/home", isProtected: false },
  { icon: Compass, label: "Explore", path: "/explore", isProtected: false },
  { icon: MessageSquare, label: "Tweets", path: "/tweets", isProtected: false },
  { 
    icon: PlaySquare, 
    label: "Subscriptions", 
    path: "/subscriptions", 
    isProtected: true,
    authTitle: "Don't miss new videos",
    authMessage: "Sign in to see updates from your favorite channels and subscriptions." 
  },
  { 
    icon: Clock, 
    label: "History", 
    path: "/history", 
    isProtected: true,
    authTitle: "Keep track of what you watch",
    authMessage: "Watch history isn't viewable when signed out. Sign in to view and manage your history." 
  },
  { 
    icon: User, 
    label: "My Library", 
    path: "/library", 
    isProtected: true,
    authTitle: "Enjoy your favorite videos",
    authMessage: "Sign in to access videos that you’ve liked or saved for later." 
  },
]

export default function Sidebar({ isExpanded }) {
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()

  const handleLinkClick = (e, item) => {
    if (item.isProtected && !user) {
      e.preventDefault()
      openAuthModal({
        title: item.authTitle || `Sign in to access ${item.label}`,
        message: item.authMessage || `Sign in to personalize your EveryTube experience.`,
        redirectTo: item.path,
      })
    }
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 select-none",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => handleLinkClick(e, item)}
            className={({ isActive }) =>
              cn(
                "group flex text-sm transition-all duration-150 relative",
                isExpanded
                  ? "items-center gap-4 px-3 py-3"
                  : "flex-col items-center gap-1 py-3 px-1 justify-center",
                isActive
                  ? "bg-gray-800 text-white font-semibold border-l-4 border-white rounded-r-xl"
                  : "border-l-4 border-transparent text-gray-400 hover:bg-gray-800 hover:text-white rounded-r-xl"
              )
            }
          >
            <div className="relative shrink-0">
              <item.icon className={cn(isExpanded ? "h-5 w-5" : "h-6 w-6")} />
              {item.isProtected && !user && isExpanded && (
                <Lock className="absolute -top-1 -right-1.5 h-3 w-3 text-gray-400 group-hover:text-gray-200 transition-colors" />
              )}
            </div>
            <span
              className={cn(
                "truncate",
                isExpanded ? "block flex-1" : "text-[10px] text-center"
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Upload & Creator Actions: Conditionally Rendered or Locked for Guests */}
      {user ? (
        <div
          className={cn(
            "p-3 border-t border-border flex",
            isExpanded ? "gap-2" : "flex-col gap-2 p-2"
          )}
        >
          <Link
            to="/tweet"
            className={cn(
              "flex flex-col items-center justify-center gap-1 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-colors text-primary",
              isExpanded ? "flex-1 p-2.5" : "p-2 w-full"
            )}
          >
            <div className="flex items-center gap-1 text-primary font-semibold">
              <PlusSquare className="h-4 w-4" />
            </div>
            {isExpanded && <span className="text-xs font-semibold">Tweet</span>}
          </Link>

          <Link
            to="/upload"
            className={cn(
              "flex flex-col items-center justify-center gap-1 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-colors text-primary",
              isExpanded ? "flex-1 p-2.5" : "p-2 w-full"
            )}
          >
            <div className="flex items-center gap-1 text-white font-semibold">
              <PlusSquare className="h-4 w-4" />
            </div>
            {isExpanded && <span className="text-xs font-semibold">Video</span>}
          </Link>
        </div>
      ) : null}
    </aside>
  )
}
