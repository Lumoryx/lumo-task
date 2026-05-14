import { create } from 'zustand'
import type { Task, AIRecommendation, ClassifyResult } from '../types/api'
import { tasksApi, type CreateTaskPayload, type UpdateTaskPayload } from '../lib/api/tasks'
import { aiApi } from '../lib/api/ai'

interface TasksState {
  tasks: Task[]
  todayTasks: Task[]
  recommendation: AIRecommendation | null
  loading: boolean
  error: string | null

  fetchTasks: () => Promise<void>
  fetchToday: () => Promise<void>
  createTask: (payload: CreateTaskPayload) => Promise<Task>
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>
  completeTask: (id: string, actualMins?: number) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleToday: (id: string, today: boolean) => Promise<void>
  startPomodoro: (taskId: string) => Promise<string>
  fetchRecommendation: () => Promise<void>
  classifyTasks: (ids: string[]) => Promise<ClassifyResult[]>
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  todayTasks: [],
  recommendation: null,
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const res = await tasksApi.list()
      set({ tasks: res.data, loading: false })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  fetchToday: async () => {
    set({ loading: true, error: null })
    try {
      const res = await tasksApi.today()
      set({
        todayTasks: res.data.tasks,
        recommendation: res.data.recommended,
        loading: false,
      })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  createTask: async (payload) => {
    const res = await tasksApi.create(payload)
    const task = res.data
    set(s => ({ tasks: [task, ...s.tasks] }))
    if (task.today) {
      set(s => ({ todayTasks: [task, ...s.todayTasks] }))
    }
    return task
  },

  updateTask: async (id, payload) => {
    const res = await tasksApi.update(id, payload)
    const updated = res.data
    set(s => ({
      tasks: s.tasks.map(t => (t.id === id ? updated : t)),
      todayTasks: s.todayTasks.map(t => (t.id === id ? updated : t)),
    }))
  },

  completeTask: async (id, actualMins) => {
    const res = await tasksApi.complete(id, actualMins)
    const updated = res.data
    set(s => ({
      tasks: s.tasks.map(t => (t.id === id ? updated : t)),
      todayTasks: s.todayTasks.filter(t => t.id !== id),
    }))
  },

  deleteTask: async (id) => {
    await tasksApi.delete(id)
    set(s => ({
      tasks: s.tasks.filter(t => t.id !== id),
      todayTasks: s.todayTasks.filter(t => t.id !== id),
    }))
  },

  toggleToday: async (id, today) => {
    const res = await tasksApi.toggleToday(id, today)
    const updated = res.data
    set(s => ({
      tasks: s.tasks.map(t => (t.id === id ? updated : t)),
      todayTasks: today
        ? [...s.todayTasks, updated]
        : s.todayTasks.filter(t => t.id !== id),
    }))
  },

  startPomodoro: async (taskId) => {
    const res = await tasksApi.startPomodoro(taskId)
    await get().updateTask(taskId, { status: 'in_progress' })
    return res.data.session_id
  },

  fetchRecommendation: async () => {
    try {
      const res = await aiApi.recommend()
      set({ recommendation: res.data })
    } catch {
      // silently fail
    }
  },

  classifyTasks: async (ids) => {
    const res = await aiApi.classify(ids)
    return res.data as ClassifyResult[]
  },
}))
