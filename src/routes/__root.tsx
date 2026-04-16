import { HeadContent, Outlet, Scripts, createRootRoute, Link, useRouter } from '@tanstack/react-router'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { AppSidebar } from '@/components/AppSidebar'
import { BrandingStyles } from '@/components/BrandingStyles'
import { IdentityProvider, useIdentity } from '@/lib/identity-context'
import { CallbackHandler } from '@/components/CallbackHandler'
import { ThemeProvider, themeInitScript } from '@/lib/theme-context'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Netlify Engineering Onboarding' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <ThemeProvider>
      <IdentityProvider>
        <CallbackHandler>
          <AuthGate />
        </CallbackHandler>
      </IdentityProvider>
    </ThemeProvider>
  )
}

function AuthGate() {
  const { user, ready } = useIdentity()
  const router = useRouter()
  const isLoginRoute = router.state.location.pathname === '/login'

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user && !isLoginRoute) {
    if (typeof window !== 'undefined') {
      router.navigate({ to: '/login' })
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting to login...</div>
      </div>
    )
  }

  if (isLoginRoute) {
    return <Outlet />
  }

  return (
    <OnboardingProvider>
      <BrandingStyles />
      <AppSidebar>
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          <Outlet />
        </div>
      </AppSidebar>
    </OnboardingProvider>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Oops! Page not found</h1>
      <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold">
        Return to Home
      </Link>
    </div>
  )
}
