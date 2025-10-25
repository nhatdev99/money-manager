'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { Transaction, CATEGORY_LABELS } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { EditTransactionForm } from '@/components/transactions/EditTransactionForm'

interface GroupedTransactions {
  [key: string]: Transaction[]
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)

  const fetchTransactions = async () => {
    if (!user) return
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

  useEffect(() => {
    fetchTransactions()
  }, [user])

  const handleDelete = async () => {
    if (!transactionToDelete) return
    try {
      await deleteDoc(doc(db, 'transactions', transactionToDelete))
      setTransactions(transactions.filter(t => t.id !== transactionToDelete))
      alert('Xóa giao dịch thành công')
    } catch (error) {
      console.error('Error deleting transaction: ', error)
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setTransactionToDelete(null)
    }
  }

  const handleEditFinish = () => {
    setTransactionToEdit(null)
    fetchTransactions() // Refetch transactions to show updated data
  }

  const groupedTransactions = transactions.reduce<GroupedTransactions>((acc, t) => {
    const date = format(new Date(t.date), 'EEEE, dd/MM/yyyy', { locale: vi })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(t)
    return acc
  }, {})

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
          <h1 className="text-2xl sm:text-3xl font-bold">Lịch sử giao dịch</h1>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giao dịch...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>Bạn chưa có giao dịch nào.</p>
            <Button className="mt-4" asChild>
              <a href="/add-transaction">Thêm giao dịch mới</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, transactionsOnDate]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-2 sticky top-16 py-2">{date}</h2>
                <div className="space-y-3">
                  {transactionsOnDate.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[t.category]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          t.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTransactionToEdit(t)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setTransactionToDelete(t.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!transactionToDelete} onOpenChange={(open: boolean) => !open && setTransactionToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác. Giao dịch sẽ bị xóa vĩnh viễn.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTransactionToDelete(null)}>Hủy</Button>
              <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Dialog */}
        <Dialog open={!!transactionToEdit} onOpenChange={(open: boolean) => !open && setTransactionToEdit(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
                </DialogHeader>
                {transactionToEdit && (
                    <EditTransactionForm 
                        transaction={transactionToEdit} 
                        onFinish={handleEditFinish}
                    />
                )}
            </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  )
}