export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
}

export type TaskInsert = Pick<Task, 'title' | 'description'>
export type TaskUpdate = Partial<Pick<Task, 'title' | 'description'>>

export type Tables = {
  profiles: Profile
  tasks: Task
}
