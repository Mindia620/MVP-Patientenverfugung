import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'

interface PageLayoutProps {
  children: ReactNode
  hideFooter?: boolean
}

export function PageLayout({ children, hideFooter }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <AppFooter />}
    </div>
  )
}
