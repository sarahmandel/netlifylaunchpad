import { HeadContent, Outlet, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { AppSidebar } from '@/components/AppSidebar'
import { SearchProvider } from '@/components/SearchCommand'
import { ThemeProvider, themeInitScript } from '@/lib/theme-context'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Netlify Onboarding' },
      {
        name: 'description',
        content:
          'Role-based onboarding that primes admins, developers, and internal builders to use Netlify with platform best practices.',
      },
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
      <OnboardingProvider>
        <SearchProvider>
          <AppSidebar>
            <div className="p-6 md:p-8 max-w-4xl mx-auto">
              <Outlet />
            </div>
          </AppSidebar>
        </SearchProvider>
      </OnboardingProvider>
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold">
        Return to Dashboard
      </Link>
    </div>
  )
}
