'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/db'
import { useAuth } from '@/components/AuthProvider'
import type { Task } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const inputClass =
  'px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 w-full'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)

  // New task
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  // Edit modal
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      getTasks(user.id).then(({ data }) => {
        setTasks(data ?? [])
        setTasksLoading(false)
      })
    }
  }, [user])

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    setAddError('')
    const { data, error } = await createTask({
      title: newTitle.trim(),
      description: newDesc.trim() || null,
    })
    if (error || !data) {
      setAddError('No se pudo agregar la tarea.')
    } else {
      setTasks(prev => [data, ...prev])
      setNewTitle('')
      setNewDesc('')
    }
    setAdding(false)
  }

  function openEdit(task: Task) {
    setEditTask(task)
    setEditTitle(task.title)
    setEditDesc(task.description ?? '')
    setEditError('')
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editTask || !editTitle.trim()) return
    setEditSaving(true)
    setEditError('')
    const { data, error } = await updateTask(editTask.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || null,
    })
    if (error || !data) {
      setEditError('No se pudo guardar los cambios.')
    } else {
      setTasks(prev => prev.map(t => (t.id === data.id ? data : t)))
      setEditTask(null)
    }
    setEditSaving(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await deleteTask(deleteId)
    if (!error) setTasks(prev => prev.filter(t => t.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  async function handleSignOut() {
    await signOut()
    router.replace('/')
  }

  if (loading) return <LoadingScreen />
  if (!user) return null

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-semibold rounded-lg font-mono">
              TF
            </span>
            <span className="text-base font-semibold text-stone-900 tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-stone-500 truncate max-w-[200px]">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-800 rounded-lg px-3 py-1.5 transition cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* Add task form */}
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-2.5 items-start">
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Nueva tarea..."
                required
                className={inputClass}
              />
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Descripción (opcional)"
                className={`${inputClass} text-xs`}
              />
            </div>
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="h-[42px] px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition whitespace-nowrap cursor-pointer"
            >
              {adding ? '...' : '+ Agregar'}
            </button>
          </div>
          {addError && (
            <p className="text-sm text-red-700 bg-red-50 px-3.5 py-2 rounded-lg mt-2">
              {addError}
            </p>
          )}
        </form>

        {/* Task list */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-base font-semibold text-stone-900 tracking-tight">Mis tareas</h2>
            <span className="bg-stone-200 text-stone-500 text-xs font-medium px-2 py-0.5 rounded-full font-mono">
              {tasks.length}
            </span>
          </div>

          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-stone-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <span className="block text-3xl mb-3">📋</span>
              <p className="text-sm">No tenés tareas todavía.</p>
              <p className="text-sm">Agregá tu primera tarea arriba.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {tasks.map(task => (
                <li
                  key={task.id}
                  className="bg-white border border-stone-200 rounded-xl px-4 py-4 flex items-start gap-3 hover:shadow-sm transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 mb-0.5">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-stone-500 mb-1.5 leading-snug">{task.description}</p>
                    )}
                    <span className="text-xs text-stone-400 font-mono">{formatDate(task.created_at)}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteId(task.id)}
                      className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editTask && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={e => { if (e.target === e.currentTarget) setEditTask(null) }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-[fadeUp_0.15s_ease]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-stone-900">Editar tarea</h3>
              <button
                onClick={() => setEditTask(null)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg p-1.5 transition cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Título</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  autoFocus
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Descripción</label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  placeholder="Descripción (opcional)"
                  className={`${inputClass} resize-y`}
                />
              </div>
              {editError && (
                <p className="text-sm text-red-700 bg-red-50 px-3.5 py-2 rounded-lg">{editError}</p>
              )}
              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setEditTask(null)}
                  className="px-4 py-2 text-sm font-medium text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-800 rounded-lg transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editSaving || !editTitle.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
                >
                  {editSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-[fadeUp_0.15s_ease]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-stone-900">Eliminar tarea</h3>
              <button
                onClick={() => setDeleteId(null)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg p-1.5 transition cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">
              ¿Estás seguro de que querés eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-800 rounded-lg transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
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