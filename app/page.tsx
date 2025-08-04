'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function Dashboard() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Golfitter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* スイング分析カード */}
          <Card>
            <CardHeader>
              <CardTitle>スイング分析</CardTitle>
              <CardDescription>
                ゴルフスイングの動画をアップロードして分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                動画をアップロード
              </Button>
            </CardContent>
          </Card>

          {/* 記録管理カード */}
          <Card>
            <CardHeader>
              <CardTitle>記録管理</CardTitle>
              <CardDescription>スコアや練習記録を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                記録を見る
              </Button>
            </CardContent>
          </Card>

          {/* プロフィール管理カード */}
          <Card>
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
              <CardDescription>ユーザー情報とゴルフ設定の管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                プロフィール編集
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ウェルカムメッセージ */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>
                ようこそ、{user?.user_metadata?.full_name || user?.email}さん！
              </CardTitle>
              <CardDescription>
                Golfitterでゴルフのスキル向上をサポートします
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                スイング分析、記録管理、プロフィール設定など、様々な機能をご利用いただけます。
                まずはスイング動画をアップロードして分析を始めてみましょう。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
