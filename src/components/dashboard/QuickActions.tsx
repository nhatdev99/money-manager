'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  BarChart3,
  Calendar,
  Download,
  Upload,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function QuickActions() {
  const router = useRouter()
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const actions = [
    {
      id: 'add-income',
      label: 'Thêm thu nhập',
      icon: TrendingUp,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      onClick: () => router.push('/transactions?type=income'),
    },
    {
      id: 'add-expense',
      label: 'Thêm chi tiêu',
      icon: TrendingDown,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      onClick: () => router.push('/transactions?type=expense'),
    },
    {
      id: 'add-saving',
      label: 'Tiết kiệm',
      icon: PiggyBank,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      onClick: () => router.push('/transactions?type=saving'),
    },
    {
      id: 'add-debt',
      label: 'Ghi nợ',
      icon: CreditCard,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50',
      onClick: () => router.push('/transactions?type=debt'),
    },
    {
      id: 'view-reports',
      label: 'Báo cáo',
      icon: BarChart3,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      onClick: () => router.push('/reports'),
    },
    {
      id: 'view-calendar',
      label: 'Lịch',
      icon: Calendar,
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50',
      onClick: () => {
        // Scroll to calendar section
        const calendar = document.getElementById('financial-calendar')
        calendar?.scrollIntoView({ behavior: 'smooth' })
      },
    },
  ]

  return (
    <Card className="rounded-xl overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Thao tác nhanh
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            const isHovered = hoveredAction === action.id

            return (
              <button
                key={action.id}
                onClick={action.onClick}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                className={`
                  group relative overflow-hidden
                  rounded-xl p-4
                  transition-all duration-300
                  hover:shadow-lg hover:scale-105
                  cursor-pointer
                  ${isHovered ? 'shadow-md' : 'shadow-sm'}
                  bg-linear-to-br ${action.bgGradient}
                  border border-gray-100
                `}
              >
                {/* Animated background */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-10
                    bg-linear-to-br ${action.gradient}
                    transition-opacity duration-300
                  `}
                />

                {/* Content */}
                <div className="relative flex flex-col items-center gap-2">
                  {/* Icon container */}
                  <div
                    className={`
                      h-12 w-12 rounded-xl
                      flex items-center justify-center
                      bg-linear-to-br ${action.gradient}
                      transform transition-transform duration-300
                      ${isHovered ? 'scale-110 rotate-3' : ''}
                      shadow-sm
                    `}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {action.label}
                  </span>

                  {/* Hover indicator */}
                  <div
                    className={`
                      absolute -bottom-1 left-1/2 -translate-x-1/2
                      h-1 rounded-full
                      bg-linear-to-r ${action.gradient}
                      transition-all duration-300
                      ${isHovered ? 'w-8' : 'w-0'}
                    `}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Additional actions */}
        <div className="mt-4 pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg"
            onClick={() => {
              // Export functionality
              alert('Tính năng xuất dữ liệu đang phát triển')
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg"
            onClick={() => {
              // Import functionality
              alert('Tính năng nhập dữ liệu đang phát triển')
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Nhập dữ liệu
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
