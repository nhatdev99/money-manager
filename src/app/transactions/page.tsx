'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Transaction,
  CATEGORY_LABELS,
  TRANSACTION_TYPE_LABELS,
  TransactionType,
} from '@/types'
import { Plus, MoreVertical, Pencil, Trash2, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = 
    useState<Transaction | undefined>()
  const [filterType, setFilterType] = useState<TransactionType | 'all'>(
    'all'
  )

  const fetchTransactions = async () => {
    if (!user) return

    try {
      const transactionsRef = collection(db, 'transactions')
      const q = query(
        transactionsRef,
        where('userId', '==', user.id),
        orderBy('date', 'desc')
      )

      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[]

      setTransactions(data)
      setFilteredTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user])

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.type === filterType)
      )
    }
  }, [filterType, transactions])

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return

    try {
      await deleteDoc(doc(db, 'transactions', id))
      await fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedTransaction(undefined)
  }

  const handleFormSuccess = async () => {
    await fetchTransactions()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-700'
      case 'expense':
        return 'bg-red-100 text-red-700'
      case 'saving':
        return 'bg-purple-100 text-purple-700'
      case 'debt':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Giao dịch
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý tất cả giao dịch của bạn
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="rounded-lg w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm giao dịch
          </Button>
        </div>

        {/* Filter */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Lọc theo loại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className="rounded-lg"
              >
                Tất cả
              </Button>
              {Object.entries(TRANSACTION_TYPE_LABELS).map(
                ([key, label]) => (
                  <Button
                    key={key}
                    variant={
                      filterType === key ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => 
                      setFilterType(key as TransactionType)
                    }
                    className="rounded-lg"
                  >
                    {label}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-xl">
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Chưa có giao dịch nào
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">
                        Số tiền
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(
                            new Date(transaction.date),
                            'dd/MM/yyyy',
                            { locale: vi }
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getTypeColor(
                              transaction.type
                            )} rounded-lg`}
                          >
                            {TRANSACTION_TYPE_LABELS[
                              transaction.type
                            ]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {CATEGORY_LABELS[transaction.category]}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(transaction)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => 
                                  handleDelete(transaction.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        transaction={selectedTransaction}
        onSuccess={handleFormSuccess}
      />
    </DashboardLayout>
  )
}
