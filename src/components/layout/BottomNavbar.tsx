'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  PlusCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Giao dịch',
    href: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Báo cáo',
    href: '/reports',
    icon: PieChart,
  },
  {
    title: 'Cài đặt',
    href: '/settings',
    icon: Settings,
  },
]

export function BottomNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}

        <div className="flex items-center justify-center">
            <Link href="/add-transaction" className="inline-flex items-center justify-center w-14 h-14 font-medium bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none">
                <PlusCircle className="w-8 h-8" />
            </Link>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
