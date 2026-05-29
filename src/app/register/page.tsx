'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { useAuth } from '../components/AuthProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setSubmitting(true)
    const { error } = await signUp(email, password)
    if (error) {
      console.log('Error al crear cuenta:', error)
      setError('No se pudo crear la cuenta. Intentá con otro email.')
      setSubmitting(false)
    } else {
      router.replace('/dashboard')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-stone-200 rounded-2xl p-10 w-full max-w-md shadow-sm">

        <div className="flex items-center gap-2.5 mb-8">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-blue-600 text-white text-xs font-semibold rounded-lg tracking-wide font-mono">
            TF
          </span>
          <span className="text-lg font-semibold text-stone-900 tracking-tight">TaskFlow</span>
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-stone-500 mb-8">Empezá a organizar tus tareas</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-stone-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              className="px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 px-3.5 py-2.5 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/" className="text-blue-600 font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stone-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}