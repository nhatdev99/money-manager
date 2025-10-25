'use client'

import { Transaction, CATEGORY_LABELS } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface DailyStatsProps {
  transactions: Transaction[]
  selectedDate: Date
}

export function DailyStats({ transactions, selectedDate }: DailyStatsProps) {
  const dailyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const dailyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <Card className="rounded-xl mt-6">
      <CardHeader>
        <CardTitle>
          Thống kê ngày {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Không có giao dịch nào trong ngày này.
          </p>
        ) : (
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card className="rounded-lg bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Tổng thu
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(dailyIncome)}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-lg bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">
                    Tổng chi
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(dailyExpense)}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-lg bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Số dư
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dailyIncome - dailyExpense)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-3">Chi tiết giao dịch</h3>
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {CATEGORY_LABELS[transaction.category]}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
