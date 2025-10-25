'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  TransactionType, 
  Category, 
  TRANSACTION_TYPE_LABELS, 
  CATEGORY_LABELS 
} from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AddTransactionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !amount || !description) {
      // Basic validation
      alert('Vui lòng điền đầy đủ thông tin.')
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.id,
        type,
        amount: parseFloat(amount),
        category: type === 'expense' ? category : 'other',
        description,
        date: new Date(date).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // TODO: Add a toast notification for success
      alert('Thêm giao dịch thành công!')
      router.push('/transactions')
    } catch (error) {
      console.error('Error adding transaction: ', error)
      // TODO: Add a toast notification for error
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Thêm giao dịch mới</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giao dịch</Label>
                <Select 
                  value={type} 
                  onValueChange={(value) => setType(value as TransactionType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại giao dịch" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRANSACTION_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {type === 'expense' && (
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as Category)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS)
                        .filter(([key]) => key !== 'salary') // Exclude salary from expenses
                        .map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="VD: Tiền ăn trưa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Ngày</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end pt-4" >
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu giao dịch'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}