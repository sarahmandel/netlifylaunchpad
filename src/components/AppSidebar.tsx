import { useState, createContext, useContext, type ReactNode } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, BookOpen, Rocket, Terminal, Award, MessageSquare, CircleCheck, PanelLeft } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

type SidebarContextType = {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({ collapsed: false, toggle: () => {} })

export function useSidebar() {
  return useContext(SidebarContext)
}

const stageNav = [
  { title: 'The Foundation', url: '/stage/1', icon: BookOpen, stage: 1 },
  { title: 'Getting Live', url: '/stage/2', icon: Rocket, stage: 2 },
  { title: 'The CLI', url: '/stage/3', icon: Terminal, stage: 3 },
  { title: 'Advanced Features', url: '/stage/4', icon: Award, stage: 4 },
]

function NavLink({ to, icon: Icon, label, verified }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; verified?: boolean }) {
  const router = useRouter()
  const isActive = router.state.location.pathname === to
  const { collapsed } = useSidebar()

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
      {verified && !collapsed && <CircleCheck className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
    </Link>
  )
}

export function AppSidebar({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const { stages } = useOnboarding()

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(c => !c) }}>
      <div className="flex min-h-screen">
        <aside className={`${collapsed ? 'w-14' : 'w-64'} shrink-0 border-r border-sidebar-border bg-sidebar-background transition-all duration-200 hidden md:flex flex-col`}>
          <div className="flex-1 overflow-y-auto py-4">
            {!collapsed && (
              <div className="px-4 py-3 mb-4">
                <h2 className="text-lg font-bold text-gradient-teal">Netlify</h2>
                <p className="text-xs text-muted-foreground">Engineering Onboarding</p>
              </div>
            )}

            <div className="px-3 space-y-1">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Overview</p>
              <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            </div>

            <div className="px-3 space-y-1 mt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Stages</p>
              {stageNav.map(s => (
                <NavLink key={s.stage} to={s.url} icon={s.icon} label={s.title} verified={stages[s.stage]?.managerVerified} />
              ))}
            </div>

            <div className="px-3 space-y-1 mt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recognition</p>
              <NavLink to="/certificate" icon={Award} label="Certificate" />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background md:hidden">
            <MobileMenu />
            <h2 className="text-sm font-bold text-gradient-teal">Netlify Onboarding</h2>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { stages } = useOnboarding()

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1.5 rounded-md hover:bg-secondary">
        <PanelLeft className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-sidebar-background border-r border-sidebar-border p-4 space-y-4 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gradient-teal">Netlify</h2>
              <p className="text-xs text-muted-foreground">Engineering Onboarding</p>
            </div>
            <div className="space-y-1" onClick={() => setOpen(false)}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Overview</p>
              <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            </div>
            <div className="space-y-1" onClick={() => setOpen(false)}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Stages</p>
              {stageNav.map(s => (
                <NavLink key={s.stage} to={s.url} icon={s.icon} label={s.title} verified={stages[s.stage]?.managerVerified} />
              ))}
            </div>
            <div className="space-y-1" onClick={() => setOpen(false)}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recognition</p>
              <NavLink to="/certificate" icon={Award} label="Certificate" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
