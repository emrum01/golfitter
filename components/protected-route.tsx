'use client'

import { useAuth } from '@/lib/auth-context'
import { AuthForm } from './auth-form'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span>読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || <AuthForm />
  }

  return <>{children}</>
} 