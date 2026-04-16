import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { getServerUser } from '@/lib/auth'
import { useIdentity } from '@/lib/identity-context'
import { Users, User, Shield, Activity, TrendingUp, Clock, CheckCircle, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { user }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = Route.useRouteContext()
  const { user: clientUser } = useIdentity()
  const activeUser = clientUser || user
  const isAdmin = activeUser?.roles?.includes('admin')
  const displayName = activeUser?.name || activeUser?.email || 'User'

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground font-medium">{displayName}</span>
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isAdmin
            ? 'bg-primary/15 text-primary border border-primary/30'
            : 'bg-secondary text-secondary-foreground border border-border'
        }`}>
          <Shield className="h-3 w-3" />
          {isAdmin ? 'Admin' : 'Member'}
        </span>
      </div>

      {isAdmin ? <AdminDashboard /> : <MemberDashboard displayName={displayName} />}
    </div>
  )
}

function AdminDashboard() {
  const mockUsers = [
    { name: 'Alice Chen', email: 'alice@example.com', role: 'member', progress: 75, lastActive: '2 hours ago' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'member', progress: 50, lastActive: '1 day ago' },
    { name: 'Carol Davis', email: 'carol@example.com', role: 'admin', progress: 100, lastActive: '5 minutes ago' },
    { name: 'Dan Lee', email: 'dan@example.com', role: 'member', progress: 25, lastActive: '3 days ago' },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="4" />
        <StatCard icon={Activity} label="Active Today" value="2" />
        <StatCard icon={TrendingUp} label="Avg Progress" value="62%" />
        <StatCard icon={CheckCircle} label="Completed" value="1" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            All Users Progress
          </h2>
        </div>
        <div className="divide-y divide-border">
          {mockUsers.map((u) => (
            <div key={u.email} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-center w-9 h-9 rounded-full gradient-teal text-primary-foreground text-sm font-bold shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                u.role === 'admin'
                  ? 'bg-primary/15 text-primary'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {u.role}
              </span>
              <div className="w-24">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{u.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full gradient-teal transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {u.lastActive}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function MemberDashboard({ displayName }: { displayName: string }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Activity} label="Your Progress" value="0%" />
        <StatCard icon={CheckCircle} label="Stages Complete" value="0 / 4" />
        <StatCard icon={Clock} label="Time Spent" value="Just started" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Onboarding Journey</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Complete each stage to earn your certificate. Start with the foundation and work your way through.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg gradient-teal px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Go to Stages
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}
