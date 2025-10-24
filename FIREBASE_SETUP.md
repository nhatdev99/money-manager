# 🔥 Hướng dẫn Setup Firebase cho MoneyFlow

## 📋 Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** hoặc **"Thêm dự án"**
3. Nhập tên project: `money-manager` (hoặc tên bạn muốn)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

## 🔐 Bước 2: Enable Authentication

1. Trong Firebase Console, chọn project vừa tạo
2. Sidebar trái → Click **"Authentication"**
3. Click tab **"Sign-in method"**
4. Enable **"Email/Password"**:
   - Click vào "Email/Password"
   - Toggle "Enable" → ON
   - Click "Save"

## 💾 Bước 3: Tạo Firestore Database

1. Sidebar trái → Click **"Firestore Database"**
2. Click **"Create database"**
3. Chọn **"Start in production mode"** (hoặc test mode cho dev)
4. Chọn location gần nhất (ví dụ: `asia-southeast1`)
5. Click **"Enable"**

### Tạo Collection `transactions`:

1. Click **"Start collection"**
2. Collection ID: `transactions`
3. Thêm document đầu tiên (sample):
   ```
   Field: userId | Type: string | Value: "sample"
   Field: type | Type: string | Value: "expense"
   Field: category | Type: string | Value: "food"
   Field: amount | Type: number | Value: 50000
   Field: description | Type: string | Value: "Ăn trưa"
   Field: date | Type: string | Value: "2024-01-01T00:00:00.000Z"
   Field: createdAt | Type: timestamp | Value: (auto)
   Field: updatedAt | Type: timestamp | Value: (auto)
   ```
4. Click **"Save"**

### Setup Firestore Rules (Security):

1. Click tab **"Rules"**
2. Paste rules sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transactions collection
    match /transactions/{transactionId} {
      // Chỉ cho phép user đọc/ghi transactions của chính họ
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Cho phép tạo transaction mới nếu userId khớp với auth
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

## 🔑 Bước 4: Lấy Firebase Config

1. Sidebar trái → Click icon ⚙️ (Settings) → **"Project settings"**
2. Scroll xuống phần **"Your apps"**
3. Click icon **"</>"** (Web app)
4. Nhập app nickname: `money-manager-web`
5. (Optional) Check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. Copy **Firebase SDK configuration**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 📝 Bước 5: Cấu hình Environment Variables

1. Tạo file `.env.local` trong root project:

```bash
cp .env.local.example .env.local
```

2. Mở `.env.local` và điền thông tin từ Firebase Config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

⚠️ **Lưu ý:** 
- KHÔNG commit file `.env.local` lên Git
- File này đã được thêm vào `.gitignore`

## ✅ Bước 6: Test Connection

1. Start development server:

```bash
npm run dev
```

2. Mở browser: `http://localhost:3000`
3. Click **"Đăng ký"**
4. Tạo tài khoản mới với email/password
5. Nếu thành công → Firebase đã được setup đúng! 🎉

## 🔍 Kiểm tra trong Firebase Console

### Authentication:
1. Firebase Console → **Authentication** → tab **"Users"**
2. Bạn sẽ thấy user vừa đăng ký

### Firestore:
1. Firebase Console → **Firestore Database**
2. Collection `transactions` sẽ xuất hiện khi bạn thêm giao dịch đầu tiên

## 🐛 Troubleshooting

### Lỗi: "Firebase: Error (auth/configuration-not-found)"

**Nguyên nhân:** Firebase chưa được cấu hình hoặc config sai

**Giải pháp:**
1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra tất cả biến môi trường đã được điền đúng
3. Restart development server: `Ctrl+C` → `npm run dev`
4. Clear browser cache và thử lại

### Lỗi: "Missing or insufficient permissions"

**Nguyên nhân:** Firestore rules chưa được setup đúng

**Giải pháp:**
1. Kiểm tra Firestore Rules trong Firebase Console
2. Đảm bảo rules cho phép authenticated users truy cập
3. Publish rules mới

### Lỗi: "Firebase: Error (auth/email-already-in-use)"

**Nguyên nhân:** Email đã được đăng ký

**Giải pháp:**
1. Sử dụng email khác
2. Hoặc đăng nhập với email đã tồn tại

## 📚 Tài liệu tham khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## 🆘 Cần hỗ trợ?

Nếu gặp vấn đề, hãy:
1. Kiểm tra lại từng bước trong hướng dẫn
2. Xem phần Troubleshooting ở trên
3. Check Firebase Console logs
4. Xem browser console để biết lỗi cụ thể

---

**Chúc bạn setup thành công! 🚀**
