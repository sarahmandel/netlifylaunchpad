import { useState, createContext, useContext, type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  CircleCheck,
  PanelLeft,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  Network,
  Search,
  Sparkles,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme } from '@/lib/theme-context'
import { useSearch } from '@/components/SearchCommand'
import { corePath, getModule, modulesByPriority, sectionOrder, sectionMeta } from '@/lib/curriculum'
import type { Role } from '@/lib/curriculum'

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
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const resolved = params
    ? Object.entries(params).reduce((acc, [key, value]) => acc.replace(`$${key}`, value), to)
    : to
  const isActive = pathname === resolved
  const { collapsed } = useSidebar()

  return (
    <Link
      to={to}
      params={params}
      className={`relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-primary transition-all duration-200 ${
          isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'
        }`}
      />
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {verified && !collapsed && <CircleCheck className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
    </Link>
  )
}

function SidebarGroup({
  label,
  children,
  onNavigate,
}: {
  label: string
  children: ReactNode
  onNavigate?: () => void
}) {
  return (
    <div className="px-3 space-y-0.5 mt-6" onClick={onNavigate}>
      <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  )
}

/**
 * A module with subsections lists them underneath itself, so the sidebar shows
 * where inside a large section the trainee is. Collapsed, only the module rail
 * is shown — nested labels have nowhere to go.
 */
function ModuleLink({ moduleId }: { moduleId: string }) {
  const { isModuleComplete, isLessonComplete } = useOnboarding()
  const { collapsed } = useSidebar()
  const mod = getModule(moduleId)
  if (!mod) return null
  const lessons = mod.lessons ?? []
  return (
    <>
      <NavLink
        to="/module/$moduleId"
        params={{ moduleId: mod.id }}
        icon={mod.icon}
        label={mod.title}
        verified={isModuleComplete(mod.id)}
      />
      {!collapsed && lessons.length > 0 && (
        <div className="ml-4 border-l border-sidebar-border pl-1.5 space-y-0.5">
          {lessons.map((lesson) => (
            <NavLink
              key={lesson.id}
              to="/module/$moduleId/$lessonId"
              params={{ moduleId: mod.id, lessonId: lesson.id }}
              icon={lesson.icon}
              label={lesson.title}
              verified={isLessonComplete(mod.id, lesson.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

/**
 * Only the selected role's core path is listed under the platform sections —
 * recommended courses get their own group and optional ones sit in Resources,
 * so the sidebar always mirrors the path the trainee is on.
 */
function PathNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const steps = corePath(role)
  return (
    <>
      {sectionOrder.map((section) => {
        const sectionModules = steps.filter((m) => m.section === section)
        if (sectionModules.length === 0) return null
        return (
          <SidebarGroup key={section} label={sectionMeta[section].label} onNavigate={onNavigate}>
            {sectionModules.map((m) => (
              <ModuleLink key={m.id} moduleId={m.id} />
            ))}
          </SidebarGroup>
        )
      })}
    </>
  )
}

function SearchTrigger() {
  const { collapsed } = useSidebar()
  const { openSearch } = useSearch()

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        title="Search (⌘K)"
        className="flex items-center justify-center w-full rounded-md py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4 shrink-0" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openSearch}
      className="flex items-center gap-2.5 w-full rounded-md border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 text-[13px] text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span>Search…</span>
      <kbd className="ml-auto flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
        ⌘K
      </kbd>
    </button>
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

/**
 * The Netlify mark in the top left is the app's home button — it navigates to
 * the question-and-search front door on every breakpoint.
 */
function BrandHome({
  compact = false,
  onNavigate,
}: {
  /** Wordmark only, no tagline — for the collapsed rail and the mobile header. */
  compact?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      title="Netlify Platform Onboarding — ask & search"
      aria-label="Go to the home page to ask and search"
      className={`flex flex-col items-center gap-2 rounded-md transition-opacity hover:opacity-80 ${
        compact ? '' : 'px-4 py-3'
      }`}
    >
      <img src="/netlify-logo.svg" alt="Netlify" className={`${compact ? 'h-5' : 'h-7'} max-w-full object-contain`} />
      {!compact && <p className="text-xs text-muted-foreground">Platform Onboarding</p>}
    </Link>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useOnboarding()
  const recommended = role ? modulesByPriority(role, 'recommended') : []
  const optional = role ? modulesByPriority(role, 'optional') : []

  return (
    <>
      <div className="px-3" onClick={onNavigate}>
        <SearchTrigger />
      </div>

      <div className="px-3 space-y-0.5 mt-4" onClick={onNavigate}>
        <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Overview</p>
        <NavLink to="/" icon={Sparkles} label="Ask & search" />
        <NavLink to="/roles" icon={LayoutDashboard} label={role ? 'Change role' : 'Choose your role'} />
        {role && (
          <NavLink to="/path/$roleId" params={{ roleId: role }} icon={Network} label="Your path" />
        )}
      </div>

      {role && <PathNav role={role} onNavigate={onNavigate} />}

      {role && recommended.length > 0 && (
        <SidebarGroup label="Recommended" onNavigate={onNavigate}>
          {recommended.map((m) => (
            <ModuleLink key={m.id} moduleId={m.id} />
          ))}
        </SidebarGroup>
      )}

      {role && (
        <SidebarGroup label="Resources" onNavigate={onNavigate}>
          <NavLink to="/docs" icon={BookOpen} label="Documentation" />
          <NavLink to="/checklist" icon={ClipboardCheck} label="Checklists" />
          <NavLink to="/prompts" icon={MessageSquare} label="Prompt Library" />
          {optional.map((m) => (
            <ModuleLink key={m.id} moduleId={m.id} />
          ))}
        </SidebarGroup>
      )}

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
            <div className={collapsed ? 'px-1 pb-3 flex justify-center' : 'mb-2'}>
              <BrandHome compact={collapsed} />
            </div>
            <SidebarNav />
            {!collapsed && <CommunityQuickLinks />}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-card md:hidden">
            <MobileMenu />
            <BrandHome compact />
            <MobileSearchButton />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

function MobileSearchButton() {
  const { openSearch } = useSearch()
  return (
    <button
      onClick={openSearch}
      aria-label="Search"
      className="ml-auto p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
    >
      <Search className="h-5 w-5" />
    </button>
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
            <div className="mb-2">
              <BrandHome onNavigate={() => setOpen(false)} />
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <CommunityQuickLinks />
          </div>
        </div>
      )}
    </>
  )
}
