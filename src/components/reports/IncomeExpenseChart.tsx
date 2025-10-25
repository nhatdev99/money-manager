'use client'

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'

interface ChartData {
  name: string
  income: number
  expense: number
}

interface IncomeExpenseChartProps {
  data: ChartData[]
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const formatCurrency = (tick: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(tick)
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value: number) => 
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
            }
          />
          <Legend />
          <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
          <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
