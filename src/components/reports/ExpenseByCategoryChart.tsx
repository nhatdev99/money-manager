'use client'

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts'
import { CATEGORY_COLORS, CATEGORY_LABELS, Category } from '@/types'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ExpenseByCategoryChartProps {
  data: Record<Category, number>
}

export function ExpenseByCategoryChart({ data }: ExpenseByCategoryChartProps) {
  const chartData: ChartData[] = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key as Category],
      value,
    }))

  if (chartData.length === 0) {
    return null
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              )
            }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={CATEGORY_COLORS[Object.keys(CATEGORY_LABELS).find(key => CATEGORY_LABELS[key as Category] === entry.name) as Category]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
              'Số tiền'
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
