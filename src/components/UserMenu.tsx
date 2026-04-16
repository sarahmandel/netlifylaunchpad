import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useIdentity } from '@/lib/identity-context'
import { LogOut, User, ChevronDown, Shield, LogIn } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function UserMenu({ collapsed }: { collapsed?: boolean }) {
  const { user, ready, isAuthenticated, logout } = useIdentity()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!ready) return null

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
      >
        <LogIn className="h-4 w-4" />
        {!collapsed && <span>Sign in</span>}
      </Link>
    )
  }

  const displayName = user?.name || user?.email || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const isAdmin = user?.roles?.includes('admin')

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-sm hover:bg-sidebar-accent/50 transition-colors"
      >
        {user?.pictureUrl ? (
          <img
            src={user.pictureUrl}
            alt={displayName}
            className="h-7 w-7 rounded-full object-cover border border-sidebar-border shrink-0"
          />
        ) : (
          <div className="h-7 w-7 rounded-full gradient-teal flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">
            {initials}
          </div>
        )}
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate leading-tight">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight">
                {isAdmin ? 'Admin' : 'Member'}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            )}
          </div>
          <div className="py-1">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Dashboard
            </Link>
            {isAdmin && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-primary">
                <Shield className="h-4 w-4" />
                Admin Access
              </div>
            )}
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive-foreground hover:bg-destructive/10 transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
