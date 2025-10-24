// Type definitions for the application

export type TransactionType = 'income' | 'expense' | 'saving' | 'debt'

export type Category = 
  | 'food' 
  | 'shopping' 
  | 'transport' 
  | 'education' 
  | 'health' 
  | 'debt' 
  | 'salary' 
  | 'other'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  category: Category
  amount: number
  description: string
  date: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date | string
}

export interface MonthlyStats {
  totalIncome: number
  totalExpense: number
  totalSaving: number
  totalDebt: number
  balance: number
  expenseByCategory: Record<Category, number>
}

export interface Budget {
  id: string
  userId: string
  category: Category
  amount: number
  month: string // Format: YYYY-MM
  createdAt: Date | string
  updatedAt: Date | string
}

// Category labels in Vietnamese
export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Ăn uống',
  shopping: 'Mua sắm',
  transport: 'Đi lại',
  education: 'Giáo dục',
  health: 'Y tế',
  debt: 'Trả nợ',
  salary: 'Lương',
  other: 'Khác',
}

// Transaction type labels in Vietnamese
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Thu nhập',
  expense: 'Chi tiêu',
  saving: 'Tiết kiệm',
  debt: 'Trả nợ',
}

// Category colors for charts
export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#ef4444',
  shopping: '#f59e0b',
  transport: '#3b82f6',
  education: '#8b5cf6',
  health: '#ec4899',
  debt: '#6366f1',
  salary: '#10b981',
  other: '#6b7280',
}
