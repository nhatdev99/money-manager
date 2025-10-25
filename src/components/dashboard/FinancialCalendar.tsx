'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Transaction } from '@/types'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns'
import { vi } from 'date-fns/locale'

interface DayStats {
  income: number
  expense: number
  balance: number
  count: number
}

interface FinancialCalendarProps {
  transactions: Transaction[]
  onDateClick?: (date: Date) => void
}

export function FinancialCalendar({ 
  transactions, 
  onDateClick 
}: FinancialCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Tính toán stats cho mỗi ngày
  const dailyStats = useMemo(() => {
    const stats: Record<string, DayStats> = {}

    transactions.forEach(transaction => {
      const dateKey = format(
        new Date(transaction.date), 
        'yyyy-MM-dd'
      )
      
      if (!stats[dateKey]) {
        stats[dateKey] = { 
          income: 0, 
          expense: 0, 
          balance: 0, 
          count: 0 
        }
      }

      if (transaction.type === 'income') {
        stats[dateKey].income += transaction.amount
        stats[dateKey].balance += transaction.amount
      } else if (transaction.type === 'expense') {
        stats[dateKey].expense += transaction.amount
        stats[dateKey].balance -= transaction.amount
      }
      
      stats[dateKey].count++
    })

    return stats
  }, [transactions])

  // Lấy các ngày trong tháng
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ 
    start: monthStart, 
    end: monthEnd 
  })

  // Thêm padding days để căn lịch
  const startDayOfWeek = monthStart.getDay()
  const paddingDays = Array(startDayOfWeek).fill(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Lịch tài chính
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="rounded-lg text-xs"
            >
              Hôm nay
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center">
                <span className="text-sm font-medium">
                  {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding days */}
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const stats = dailyStats[dateKey]
            const hasTransactions = stats && stats.count > 0
            const isCurrentDay = isToday(day)

            return (
              <button
                key={dateKey}
                onClick={() => onDateClick?.(day)}
                className={`
                  aspect-square p-1 rounded-lg
                  transition-all duration-200
                  hover:bg-gray-50 hover:shadow-sm
                  cursor-pointer
                  ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                  ${hasTransactions ? 'bg-linear-to-r' : ''}
                  ${
                    hasTransactions && stats.balance > 0
                      ? 'from-green-50 to-green-100/50'
                      : ''
                  }
                  ${
                    hasTransactions && stats.balance < 0
                      ? 'from-red-50 to-red-100/50'
                      : ''
                  }
                  ${
                    hasTransactions && stats.balance === 0
                      ? 'from-gray-50 to-gray-100/50'
                      : ''
                  }
                `}
              >
                <div className="flex flex-col h-full">
                  {/* Day number */}
                  <div
                    className={`
                      text-xs font-medium mb-auto
                      ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}
                    `}
                  >
                    {format(day, 'd')}
                  </div>

                  {/* Stats */}
                  {hasTransactions && (
                    <div className="space-y-0.5 mt-1">
                      {/* Income */}
                      {stats.income > 0 && (
                        <div className="text-[10px] font-medium text-green-600">
                          +{formatCurrency(stats.income)}
                        </div>
                      )}
                      
                      {/* Expense */}
                      {stats.expense > 0 && (
                        <div className="text-[10px] font-medium text-red-600">
                          -{formatCurrency(stats.expense)}
                        </div>
                      )}

                      {/* Transaction count badge */}
                      <div className="flex justify-center">
                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-linear-to-r from-green-50 to-green-100 border border-green-200" />
            <span className="text-gray-600">Thu &gt; Chi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-linear-to-r from-red-50 to-red-100 border border-red-200" />
            <span className="text-gray-600">Chi &gt; Thu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">Có giao dịch</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
