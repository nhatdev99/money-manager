'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Transaction, 
  TransactionType, 
  Category,
  CATEGORY_LABELS,
  TRANSACTION_TYPE_LABELS 
} from '@/types'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'saving', 'debt']),
  category: z.enum([
    'food',
    'shopping',
    'transport',
    'education',
    'health',
    'debt',
    'salary',
    'other',
  ]),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  date: z.string(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  onSuccess: () => void
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          date: new Date(transaction.date)
            .toISOString()
            .split('T')[0],
        }
      : {
          type: 'expense',
          category: 'other',
          amount: 0,
          description: '',
          date: new Date().toISOString().split('T')[0],
        },
  })

  const type = watch('type')
  const category = watch('category')

  const onSubmit = async (data: TransactionFormData) => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const transactionData = {
        userId: user.id,
        type: data.type,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: new Date(data.date).toISOString(),
        updatedAt: serverTimestamp(),
      }

      if (transaction) {
        // Update existing transaction
        await updateDoc(
          doc(db, 'transactions', transaction.id),
          transactionData
        )
      } else {
        // Create new transaction
        await addDoc(collection(db, 'transactions'), {
          ...transactionData,
          createdAt: serverTimestamp(),
        })
      }

      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Error saving transaction:', err)
      setError('Đã xảy ra lỗi. Vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? 'Cập nhật thông tin giao dịch'
              : 'Nhập thông tin giao dịch của bạn'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Loại giao dịch</Label>
            <Select
              value={type}
              onValueChange={(value) => 
                setValue('type', value as TransactionType)
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSACTION_TYPE_LABELS).map(
                  ([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select
              value={category}
              onValueChange={(value) => 
                setValue('category', value as Category)
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(
                  ([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              className="rounded-lg"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Ngày</Label>
            <Input
              id="date"
              type="date"
              className="rounded-lg"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-red-600">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả giao dịch..."
              className="rounded-lg resize-none"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-lg"
            >
              {loading
                ? 'Đang lưu...'
                : transaction
                ? 'Cập nhật'
                : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
