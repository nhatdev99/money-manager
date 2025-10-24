'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Cài đặt
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý thông tin tài khoản và tùy chọn
          </p>
        </div>

        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Thông tin cá nhân</CardTitle>
            </div>
            <CardDescription>
              Cập nhật thông tin tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Họ và tên</Label>
              <Input
                id="displayName"
                defaultValue={user?.displayName}
                className="rounded-lg"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                className="rounded-lg"
                disabled
              />
              <p className="text-xs text-gray-500">
                Email không thể thay đổi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Thông báo</CardTitle>
            </div>
            <CardDescription>
              Quản lý cách bạn nhận thông báo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo email</p>
                <p className="text-sm text-gray-500">
                  Nhận thông báo qua email
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Bật
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nhắc nhở hàng ngày</p>
                <p className="text-sm text-gray-500">
                  Nhắc nhở ghi chép giao dịch
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Tắt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Bảo mật</CardTitle>
            </div>
            <CardDescription>
              Quản lý mật khẩu và bảo mật tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Đổi mật khẩu</p>
                <p className="text-sm text-gray-500">
                  Cập nhật mật khẩu của bạn
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Đổi mật khẩu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Giao diện</CardTitle>
            </div>
            <CardDescription>
              Tùy chỉnh giao diện ứng dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chế độ tối</p>
                <p className="text-sm text-gray-500">
                  Chuyển sang giao diện tối
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Sắp có
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
