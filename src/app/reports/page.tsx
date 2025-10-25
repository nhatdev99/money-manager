'use client'

import { useEffect, useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { Transaction, Category } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { ExpenseByCategoryChart } from '@/components/reports/ExpenseByCategoryChart'
import { IncomeExpenseChart } from '@/components/reports/IncomeExpenseChart'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export default function ReportsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('this_month')

  useEffect(() => {
    if (!user) return

    const fetchTransactions = async () => {
      setLoading(true)
      const transactionsRef = collection(db, 'transactions')
      const q = query(
        transactionsRef,
        where('userId', '==', user.id),
        orderBy('date', 'desc')
      )
      const snapshot = await getDocs(q)
      const userTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[]
      setTransactions(userTransactions)
      setLoading(false)
    }

    fetchTransactions()
  }, [user])

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    let startDate: Date | null = null

    switch (filter) {
      case 'this_month':
        startDate = startOfMonth(now)
        break
      case 'last_month':
        startDate = startOfMonth(subMonths(now, 1))
        break;
      case 'all_time':
      default:
        startDate = null
        break
    }
    
    if (!startDate) return transactions

    const endDate = filter === 'last_month' ? endOfMonth(subMonths(now, 1)) : new Date();

    return transactions.filter(t => {
      const tDate = new Date(t.date)
      return tDate >= startDate! && tDate <= endDate
    })
  }, [transactions, filter])

  const reportData = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0
        }
        acc[t.category] += t.amount
        return acc
      }, {} as Record<Category, number>)

    const incomeExpenseByMonth = filteredTransactions.reduce((acc, t) => {
        const month = format(new Date(t.date), 'yyyy-MM');
        if (!acc[month]) {
            acc[month] = { name: format(new Date(t.date), 'MMM yy'), income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            acc[month].income += t.amount;
        }
        if (t.type === 'expense') {
            acc[month].expense += t.amount;
        }
        return acc;
    }, {} as Record<string, {name: string, income: number, expense: number}>)

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      expenseByCategory,
      incomeExpenseChartData: Object.values(incomeExpenseByMonth).sort((a, b) => a.name.localeCompare(b.name)),
    }
  }, [filteredTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Báo cáo tài chính</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">Tháng này</SelectItem>
              <SelectItem value="last_month">Tháng trước</SelectItem>
              <SelectItem value="all_time">Toàn thời gian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải báo cáo...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader><CardTitle>Tổng thu nhập</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.totalIncome)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Tổng chi tiêu</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold text-red-600">
                  {formatCurrency(reportData.totalExpense)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Số dư</CardTitle></CardHeader>
                <CardContent className={`text-2xl font-bold ${reportData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(reportData.balance)}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Thu nhập vs Chi tiêu</CardTitle></CardHeader>
              <CardContent>
                <IncomeExpenseChart data={reportData.incomeExpenseChartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Chi tiêu theo danh mục</CardTitle></CardHeader>
              <CardContent>
                <ExpenseByCategoryChart data={reportData.expenseByCategory} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
