import { createClient } from './supabase'
import type { AuthResponse, UserResponse } from '@supabase/supabase-js'

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const supabase = createClient()
  return supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut(): Promise<{ error: Error | null }> {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export async function getUser(): Promise<UserResponse> {
  const supabase = createClient()
  return supabase.auth.getUser()
}

export function onAuthStateChange(
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED', session: unknown) => void
) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED', session)
  })
}
