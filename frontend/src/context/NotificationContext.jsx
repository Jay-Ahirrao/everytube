import { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

const NotificationContext = createContext(null)

let notificationId = 0

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addNotification = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = ++notificationId
    setNotifications((prev) => [...prev, { id, type, title, message }])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }, [removeNotification])

  const success = useCallback((message, title) => {
    return addNotification({ type: "success", title, message })
  }, [addNotification])

  const error = useCallback((message, title) => {
    return addNotification({ type: "error", title: title || "Something went wrong", message })
  }, [addNotification])

  const info = useCallback((message, title) => {
    return addNotification({ type: "info", title, message })
  }, [addNotification])

  return (
    <NotificationContext.Provider value={{ success, error, info, removeNotification }}>
      {children}
      {/* Fixed Toast Container: zero layout shift on page content */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {notifications.map((item) => (
          <div
            key={item.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              item.type === "success"
                ? "bg-zinc-950/95 border-emerald-500/30 text-white"
                : item.type === "error"
                ? "bg-zinc-950/95 border-rose-500/30 text-white"
                : "bg-zinc-950/95 border-white/15 text-white"
            }`}
          >
            {/* Status Icon */}
            <div
              className={`p-1.5 rounded-lg shrink-0 mt-0.5 border ${
                item.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : item.type === "error"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-teal-500/10 border-teal-500/20 text-teal-400"
              }`}
            >
              {item.type === "success" && <CheckCircle2 className="h-4 w-4" />}
              {item.type === "error" && <AlertCircle className="h-4 w-4" />}
              {item.type === "info" && <Info className="h-4 w-4" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              {item.title && (
                <p className="text-xs font-semibold text-white leading-tight mb-0.5 truncate">
                  {item.title}
                </p>
              )}
              <p className="text-xs text-zinc-300 leading-snug break-words">
                {item.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => removeNotification(item.id)}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
