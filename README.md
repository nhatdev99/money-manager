# 💰 MoneyFlow - Ứng dụng Quản lý Tài chính Cá nhân

Ứng dụng quản lý thu chi, tiết kiệm và báo cáo tài chính được xây dựng với Next.js 14, TypeScript, Firebase và Tailwind CSS.

## ✨ Tính năng

### 📊 Dashboard Tổng quan
- Thống kê thu nhập, chi tiêu, tiết kiệm, trả nợ
- Số dư hiện tại
- Biểu đồ chi tiêu theo danh mục
- Giao dịch gần đây

### 💸 Quản lý Giao dịch
- Thêm/sửa/xóa giao dịch
- Phân loại: Thu nhập, Chi tiêu, Tiết kiệm, Trả nợ
- Danh mục: Ăn uống, Mua sắm, Đi lại, Giáo dục, Y tế, Trả nợ, Lương, Khác
- Lọc theo loại giao dịch
- Tìm kiếm và sắp xếp

### 📈 Báo cáo & Phân tích
- Biểu đồ cột: Tổng quan thu chi
- Biểu đồ tròn: Chi tiêu theo danh mục
- Chi tiết phần trăm từng danh mục
- Lọc theo tháng (12 tháng gần nhất)

### 🔐 Xác thực
- Đăng ký/Đăng nhập với Email & Password
- Firebase Authentication
- Bảo mật session

### 🎨 Giao diện
- Dashboard hiện đại với sidebar có thể đóng/mở
- Responsive design (Desktop, Tablet, Mobile)
- Bo tròn các góc card và button
- Color-coded theo loại giao dịch
- Loading states và error handling

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **Charts:** Recharts
- **Form:** React Hook Form + Zod
- **Icons:** Lucide React
- **Date:** date-fns

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd money-manager
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

Tạo file `.env.local` từ `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Cập nhật các biến môi trường Firebase trong `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Firebase

1. Tạo project tại [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** với Email/Password
3. Tạo **Firestore Database**
4. Thêm collection `transactions` với cấu trúc:

```typescript
{
  userId: string
  type: 'income' | 'expense' | 'saving' | 'debt'
  category: 'food' | 'shopping' | 'transport' | 'education' | 'health' | 'debt' | 'salary' | 'other'
  amount: number
  description: string
  date: string (ISO)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc Dự án

```
src/
├── app/
│   ├── dashboard/          # Trang tổng quan
│   ├── transactions/       # Quản lý giao dịch
│   ├── reports/           # Báo cáo & biểu đồ
│   ├── settings/          # Cài đặt
│   ├── login/             # Đăng nhập
│   ├── register/          # Đăng ký
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx  # Layout chính với sidebar
│   ├── transactions/
│   │   └── TransactionForm.tsx  # Form thêm/sửa giao dịch
│   └── ui/                # Shadcn UI components
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   ├── firebase.ts        # Firebase config
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## 🎯 Tính năng Chính

### Dashboard
- **4 Stats Cards:** Thu nhập, Chi tiêu, Số dư, Tiết kiệm
- **Chi tiêu theo danh mục:** Progress bars với màu sắc riêng
- **Giao dịch gần đây:** 5 giao dịch mới nhất

### Transactions
- **CRUD Operations:** Thêm, sửa, xóa giao dịch
- **Filter:** Lọc theo loại (Tất cả, Thu nhập, Chi tiêu, Tiết kiệm, Trả nợ)
- **Table View:** Hiển thị đầy đủ thông tin với actions

### Reports
- **Month Selector:** Chọn tháng để xem báo cáo
- **Summary Cards:** 5 cards tổng hợp
- **Bar Chart:** So sánh thu nhập, chi tiêu, tiết kiệm, trả nợ
- **Pie Chart:** Phân bổ chi tiêu theo danh mục
- **Detailed Breakdown:** Chi tiết từng danh mục với progress bars

## 🚀 Deployment

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm Environment Variables từ `.env.local`
4. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## 📝 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Chạy ESLint
```

## 🎨 Customization

### Thay đổi màu sắc

Chỉnh sửa `src/types/index.ts`:

```typescript
export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#ef4444',      // Đỏ
  shopping: '#f59e0b',  // Cam
  transport: '#3b82f6', // Xanh dương
  // ...
}
```

### Thêm danh mục mới

1. Cập nhật type `Category` trong `src/types/index.ts`
2. Thêm label vào `CATEGORY_LABELS`
3. Thêm màu vào `CATEGORY_COLORS`

## 🔒 Bảo mật

- Firebase Authentication cho user management
- Firestore Security Rules để bảo vệ data
- Client-side validation với Zod
- Protected routes với AuthContext

## 📱 Responsive Design

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

Sidebar tự động collapse trên mobile và có thể toggle.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Được xây dựng với ❤️ bởi [Your Name]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
