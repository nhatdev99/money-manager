'use client'

import { BottomNavbar } from './BottomNavbar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Wallet } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-foreground">Quản lý chi tiêu</span>
          </Link>
          <div className="flex items-center gap-3">
              <ThemeToggle />
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
      </header>
      <main className="pb-20">{children}</main>
      <BottomNavbar />
    </div>
  )
}
