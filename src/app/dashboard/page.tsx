'use client'

import { useEffect, useState } from 'react'
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Transaction, 
  MonthlyStats,
  CATEGORY_LABELS,
  CATEGORY_COLORS 
} from '@/types'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { FinancialCalendar } from '@/components/dashboard/FinancialCalendar'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { DailyStats } from '@/components/dashboard/DailyStats'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<MonthlyStats>({
    totalIncome: 0,
    totalExpense: 0,
    totalSaving: 0,
    totalDebt: 0,
    balance: 0,
    expenseByCategory: {
      food: 0,
      shopping: 0,
      transport: 0,
      education: 0,
      health: 0,
      debt: 0,
      salary: 0,
      other: 0,
    },
  })
  const [recentTransactions, setRecentTransactions] = useState<
    Transaction[]
  >([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dailyTransactions, setDailyTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Get current month transactions
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const transactionsRef = collection(db, 'transactions')
        const q = query(
          transactionsRef,
          where('userId', '==', user.id),
          where('date', '>=', firstDay.toISOString()),
          orderBy('date', 'desc')
        )

        const snapshot = await getDocs(q)
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[]

        // Calculate stats
        const newStats: MonthlyStats = {
          totalIncome: 0,
          totalExpense: 0,
          totalSaving: 0,
          totalDebt: 0,
          balance: 0,
          expenseByCategory: {
            food: 0,
            shopping: 0,
            transport: 0,
            education: 0,
            health: 0,
            debt: 0,
            salary: 0,
            other: 0,
          },
        }

        transactions.forEach(transaction => {
          switch (transaction.type) {
            case 'income':
              newStats.totalIncome += transaction.amount
              break
            case 'expense':
              newStats.totalExpense += transaction.amount
              newStats.expenseByCategory[transaction.category] += 
                transaction.amount
              break
            case 'saving':
              newStats.totalSaving += transaction.amount
              break
            case 'debt':
              newStats.totalDebt += transaction.amount
              break
          }
        })

        newStats.balance = 
          newStats.totalIncome - 
          newStats.totalExpense - 
          newStats.totalSaving - 
          newStats.totalDebt

        setStats(newStats)
        setAllTransactions(transactions)
        setRecentTransactions(transactions.slice(0, 5))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const filtered = allTransactions.filter(t => 
      isSameDay(new Date(t.date), date)
    )
    setDailyTransactions(filtered)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tổng quan tài chính
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Thống kê tháng {format(new Date(), 'MM/yyyy', { locale: vi })}
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Income */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng thu nhập
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalIncome)}
              </div>
            </CardContent>
          </Card>

          {/* Total Expense */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng chi tiêu
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalExpense)}
              </div>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Số dư
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {formatCurrency(stats.balance)}
              </div>
            </CardContent>
          </Card>

          {/* Total Saving */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiết kiệm
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.totalSaving)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Calendar */}
        <div id="financial-calendar">
          <FinancialCalendar 
            transactions={allTransactions}
            onDateClick={handleDateClick}
          />
        </div>

        {selectedDate && (
          <DailyStats 
            transactions={dailyTransactions} 
            selectedDate={selectedDate} 
          />
        )}

        {/* Charts and Recent Transactions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expense by Category */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Chi tiêu theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.expenseByCategory)
                  .filter(([_, amount]) => amount > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const percentage = 
                      (amount / stats.totalExpense) * 100
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                          </span>
                          <span className="text-gray-600">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                {stats.totalExpense === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có chi tiêu nào trong tháng này
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[transaction.category]} •{' '}
                        {format(
                          new Date(transaction.date), 
                          'dd/MM/yyyy',
                          { locale: vi }
                        )}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có giao dịch nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}