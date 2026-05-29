import { createClient } from './supabase'
import type { Task, TaskInsert, TaskUpdate } from './types'

export async function getTasks(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data: data as Task[] | null, error }
}

export async function createTask(data: TaskInsert) {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { data: null, error: userError ?? new Error('No autenticado') }

  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert({ ...data, user_id: user.id })
    .select()
    .single()

  return { data: newTask as Task | null, error }
}

export async function updateTask(id: string, data: TaskUpdate) {
  const supabase = createClient()
  const { data: updatedTask, error } = await supabase
    .from('tasks')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  return { data: updatedTask as Task | null, error }
}

export async function deleteTask(id: string) {
  const supabase = createClient()
  const { data: deletedTask, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
    .single()

  return { data: deletedTask as Task | null, error }
}
