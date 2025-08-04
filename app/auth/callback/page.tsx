'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証コールバックエラー:', error)
          setError('認証に失敗しました。もう一度お試しください。')
          return
        }

        if (data.session) {
          // 認証成功、ホームページにリダイレクト
          router.push('/')
        } else {
          // セッションが見つからない場合
          setError('認証セッションが見つかりません。')
        }
      } catch (err) {
        console.error('予期しないエラー:', err)
        setError('予期しないエラーが発生しました。')
      }
    }

    handleAuthCallback()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">
            認証エラー
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">認証中...</p>
      </div>
    </div>
  )
} 