'use client'

import { useState, useEffect } from 'react'
import { 
  Transaction, 
  TransactionType, 
  Category, 
  TRANSACTION_TYPE_LABELS, 
  CATEGORY_LABELS 
} from '@/types'
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
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface EditTransactionFormProps {
  transaction: Transaction
  onFinish: () => void
}

export function EditTransactionForm({ transaction, onFinish }: EditTransactionFormProps) {
  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [category, setCategory] = useState<Category>(transaction.category)
  const [description, setDescription] = useState(transaction.description)
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description) {
      alert('Vui lòng điền đầy đủ thông tin.')
      return
    }

    setIsSubmitting(true)

    try {
      const transactionRef = doc(db, 'transactions', transaction.id)
      await updateDoc(transactionRef, {
        type,
        amount: parseFloat(amount),
        category: type === 'expense' ? category : 'other',
        description,
        date: new Date(date).toISOString(),
        updatedAt: serverTimestamp(),
      })
      
      alert('Cập nhật giao dịch thành công!')
      onFinish()
    } catch (error) {
      console.error('Error updating transaction: ', error)
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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
                  .filter(([key]) => key !== 'salary')
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

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFinish}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
        </div>
      </div>
    </form>
  )
}
