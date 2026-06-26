export function isTaskOverdue(dueDate: string, now: Date = new Date()): boolean {
  return new Date(dueDate) < now
}

export function getTaskCompletionPercentage(tasks: { done: boolean }[]): number {
  if (tasks.length === 0) return 0
  const completed = tasks.filter(t => t.done).length
  return Math.round((completed / tasks.length) * 100)
}
