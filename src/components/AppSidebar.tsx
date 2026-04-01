import { useState, createContext, useContext, type ReactNode } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { LayoutDashboard, BookOpen, Rocket, Terminal, Award, CircleCheck, PanelLeft, ClipboardCheck, MessageSquare, LifeBuoy, Paintbrush, Hash } from 'lucide-react'
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

function FloatingSupportButton() {
  return (
    <Link
      to="/support"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full gradient-teal text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity animate-fade-in glow-teal"
    >
      <LifeBuoy className="h-5 w-5" />
      <span className="hidden sm:inline">Get Support</span>
    </Link>
  )
}

function CommunityQuickLinks() {
  return (
    <div className="px-3 mt-4 pt-4 border-t border-sidebar-border">
      <div className="flex items-center gap-2 justify-center">
        <a href="https://netlify.slack.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground" title="Slack">
          <Hash className="h-4 w-4" />
        </a>
        <a href="https://answers.netlify.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground" title="Netlify Forum">
          <MessageSquare className="h-4 w-4" />
        </a>
        <a href="https://discord.gg/netlify" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground" title="Discord">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
        </a>
      </div>
    </div>
  )
}

export function AppSidebar({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const { stages, branding } = useOnboarding()
  const companyName = branding.companyName || 'Netlify'

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(c => !c) }}>
      <div className="flex min-h-screen">
        <aside className={`${collapsed ? 'w-14' : 'w-64'} shrink-0 border-r border-sidebar-border bg-sidebar-background transition-all duration-200 hidden md:flex flex-col`}>
          <div className="flex-1 overflow-y-auto py-4">
            {!collapsed && (
              <div className="px-4 py-3 mb-4 flex flex-col items-center gap-2">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt={companyName} className="h-7 w-7 object-contain" />
                ) : (
                  <img src="/netlify-logo.svg" alt="Netlify" className="h-7 object-contain" />
                )}
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
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
              <NavLink to="/checklist" icon={ClipboardCheck} label="Checklists" />
              <NavLink to="/prompts" icon={MessageSquare} label="Prompt Library" />
            </div>

            <div className="px-3 space-y-1 mt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Settings</p>
              <NavLink to="/branding" icon={Paintbrush} label="Branding" />
              <NavLink to="/support" icon={LifeBuoy} label="Support" />
            </div>

            <div className="px-3 space-y-1 mt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recognition</p>
              <NavLink to="/certificate" icon={Award} label="Certificate" />
            </div>

            {!collapsed && <CommunityQuickLinks />}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background md:hidden">
            <MobileMenu />
            <img src="/netlify-logo.svg" alt="Netlify" className="h-5 object-contain" />
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <FloatingSupportButton />
    </SidebarContext.Provider>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { stages, branding } = useOnboarding()
  const companyName = branding.companyName || 'Netlify'

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1.5 rounded-md hover:bg-secondary">
        <PanelLeft className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-sidebar-background border-r border-sidebar-border p-4 space-y-4 overflow-y-auto">
            <div className="mb-4 flex flex-col items-center gap-2">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={companyName} className="h-7 w-7 object-contain" />
              ) : (
                <img src="/netlify-logo.svg" alt="Netlify" className="h-7 object-contain" />
              )}
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
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
              <NavLink to="/checklist" icon={ClipboardCheck} label="Checklists" />
              <NavLink to="/prompts" icon={MessageSquare} label="Prompt Library" />
            </div>
            <div className="space-y-1" onClick={() => setOpen(false)}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Settings</p>
              <NavLink to="/branding" icon={Paintbrush} label="Branding" />
              <NavLink to="/support" icon={LifeBuoy} label="Support" />
            </div>
            <div className="space-y-1" onClick={() => setOpen(false)}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recognition</p>
              <NavLink to="/certificate" icon={Award} label="Certificate" />
            </div>
            <div className="flex items-center gap-2 justify-center pt-4 border-t border-sidebar-border">
              <a href="https://netlify.slack.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors" title="Slack">
                <Hash className="h-4 w-4" />
              </a>
              <a href="https://answers.netlify.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors" title="Forum">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href="https://discord.gg/netlify" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors" title="Discord">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
