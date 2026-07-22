import { useState, createContext, useContext, type ReactNode } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  CircleCheck,
  PanelLeft,
  ClipboardCheck,
  MessageSquare,
  LifeBuoy,
  Award,
  BookOpen,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme } from '@/lib/theme-context'
import { modules, sectionOrder, sectionMeta } from '@/lib/curriculum'

type SidebarContextType = {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({ collapsed: false, toggle: () => {} })

export function useSidebar() {
  return useContext(SidebarContext)
}

function NavLink({
  to,
  params,
  icon: Icon,
  label,
  verified,
}: {
  to: string
  params?: Record<string, string>
  icon: LucideIcon
  label: string
  verified?: boolean
}) {
  const router = useRouter()
  const isActive = router.state.location.pathname === (params ? to.replace('$moduleId', params.moduleId) : to)
  const { collapsed } = useSidebar()

  return (
    <Link
      to={to}
      params={params}
      className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {verified && !collapsed && <CircleCheck className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
    </Link>
  )
}

function ModuleNav({ onNavigate }: { onNavigate?: () => void }) {
  const { isModuleComplete } = useOnboarding()
  return (
    <>
      {sectionOrder.map((section) => {
        const sectionModules = modules.filter((m) => m.section === section)
        if (sectionModules.length === 0) return null
        return (
          <div key={section} className="px-3 space-y-0.5 mt-6" onClick={onNavigate}>
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              {sectionMeta[section].label}
            </p>
            {sectionModules.map((m) => (
              <NavLink
                key={m.id}
                to="/module/$moduleId"
                params={{ moduleId: m.id }}
                icon={m.icon}
                label={m.title}
                verified={isModuleComplete(m.id)}
              />
            ))}
          </div>
        )
      })}
    </>
  )
}

function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon
  const label = isDark ? 'Light mode' : 'Dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${label.toLowerCase()}`}
      title={label}
      className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  )
}

function CommunityQuickLinks() {
  return (
    <div className="px-3 mt-4 pt-4 border-t border-sidebar-border">
      <div className="flex items-center gap-2 justify-center">
        <a
          href="https://docs.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground"
          title="Netlify Docs"
        >
          <BookOpen className="h-4 w-4" />
        </a>
        <a
          href="https://answers.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground"
          title="Netlify Support Forums"
        >
          <MessageSquare className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="px-3 space-y-0.5" onClick={onNavigate}>
        <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Overview</p>
        <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
      </div>

      <ModuleNav onNavigate={onNavigate} />

      <div className="px-3 space-y-0.5 mt-6" onClick={onNavigate}>
        <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Resources</p>
        <NavLink to="/checklist" icon={ClipboardCheck} label="Checklists" />
        <NavLink to="/prompts" icon={MessageSquare} label="Prompt Library" />
        <NavLink to="/support" icon={LifeBuoy} label="Support" />
        <NavLink to="/certificate" icon={Award} label="Certificate" />
      </div>

      <div className="px-3 space-y-0.5 mt-6">
        <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Settings</p>
        <ThemeToggle />
      </div>
    </>
  )
}

export function AppSidebar({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      <div className="flex min-h-screen">
        <aside
          className={`${
            collapsed ? 'w-14' : 'w-64'
          } shrink-0 border-r border-sidebar-border bg-sidebar-background transition-all duration-200 hidden md:flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto py-5">
            {!collapsed && (
              <div className="px-4 py-3 mb-2 flex flex-col items-center gap-2">
                <img src="/netlify-logo.svg" alt="Netlify" className="h-7 object-contain" />
                <p className="text-xs text-muted-foreground">Platform Onboarding</p>
              </div>
            )}
            <SidebarNav />
            {!collapsed && <CommunityQuickLinks />}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-card md:hidden">
            <MobileMenu />
            <img src="/netlify-logo.svg" alt="Netlify" className="h-5 object-contain" />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-1.5 rounded-md hover:bg-secondary">
        <PanelLeft className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-sidebar-background border-r border-sidebar-border py-5 space-y-1 overflow-y-auto">
            <div className="px-4 mb-2 flex flex-col items-center gap-2">
              <img src="/netlify-logo.svg" alt="Netlify" className="h-7 object-contain" />
              <p className="text-xs text-muted-foreground">Platform Onboarding</p>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <CommunityQuickLinks />
          </div>
        </div>
      )}
    </>
  )
}
