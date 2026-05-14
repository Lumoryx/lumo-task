import { http, HttpResponse } from 'msw'
import { nanoid } from 'nanoid'
import { seedTasks } from '../seed'
import type { Task } from '../../types/api'

let tasks: Task[] = [...seedTasks]

export const taskHandlers = [
  http.get('/api/v1/tasks', ({ request }) => {
    const url = new URL(request.url)
    const quadrant = url.searchParams.get('quadrant')
    const today = url.searchParams.get('today')

    let result = tasks.filter(t => t.status !== 'cancelled')
    if (quadrant) result = result.filter(t => t.quadrant === quadrant)
    if (today === 'true') result = result.filter(t => t.today)

    return HttpResponse.json({ data: result, total: result.length })
  }),

  http.get('/api/v1/tasks/today', () => {
    const todayTasks = tasks.filter(t => t.today && t.status !== 'completed' && t.status !== 'cancelled')
    const recommended = tasks.find(t => t.conviction && t.conviction > 0.8 && t.today) ?? todayTasks[0]

    return HttpResponse.json({
      data: {
        tasks: todayTasks,
        recommended: recommended
          ? {
              task: recommended,
              reason: recommended.ai_reason ?? { en: 'This task has the highest priority today.', zh: '这个任务今天优先级最高。' },
              conviction: recommended.conviction ?? 0.85,
              not_now: todayTasks
                .filter(t => t.id !== recommended.id)
                .slice(0, 2)
                .map(t => ({ task_id: t.id, reason: { en: 'Lower priority than the recommended task.', zh: '优先级低于推荐任务。' } })),
            }
          : null,
      },
    })
  }),

  http.get('/api/v1/tasks/:id', ({ params }) => {
    const task = tasks.find(t => t.id === params.id)
    if (!task) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    return HttpResponse.json({ data: task })
  }),

  http.post('/api/v1/tasks', async ({ request }) => {
    const body = await request.json() as {
      title: string
      description?: string
      quadrant?: string
      priority?: string
      today?: boolean
      due_date?: string
      estimated_mins?: number
      estimated_pomos?: number
    }
    const task: Task = {
      id: nanoid(),
      title: { en: body.title },
      description: body.description ? { en: body.description } : undefined,
      status: 'pending',
      quadrant: (body.quadrant as Task['quadrant']) ?? 'unclassified',
      priority: (body.priority as Task['priority']) ?? 'medium',
      today: body.today ?? false,
      due_date: body.due_date,
      estimated_mins: body.estimated_mins,
      actual_mins: 0,
      estimated_pomos: body.estimated_pomos ?? 1,
      actual_pomos: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    tasks = [task, ...tasks]
    return HttpResponse.json({ data: task }, { status: 201 })
  }),

  http.patch('/api/v1/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<Task>
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    tasks[idx] = { ...tasks[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json({ data: tasks[idx] })
  }),

  http.patch('/api/v1/tasks/:id/complete', async ({ params, request }) => {
    const body = await request.json() as { actual_mins?: number }
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    tasks[idx] = {
      ...tasks[idx],
      status: 'completed',
      actual_mins: body.actual_mins ?? tasks[idx].actual_mins,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json({ data: tasks[idx] })
  }),

  http.patch('/api/v1/tasks/:id/today', async ({ params, request }) => {
    const body = await request.json() as { today: boolean }
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    tasks[idx] = { ...tasks[idx], today: body.today, updated_at: new Date().toISOString() }
    return HttpResponse.json({ data: tasks[idx] })
  }),

  http.delete('/api/v1/tasks/:id', ({ params }) => {
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    tasks[idx] = { ...tasks[idx], status: 'cancelled', updated_at: new Date().toISOString() }
    return HttpResponse.json({ data: { deleted: true } })
  }),

  http.post('/api/v1/tasks/:id/pomodoros', ({ params }) => {
    const task = tasks.find(t => t.id === params.id)
    if (!task) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    const idx = tasks.indexOf(task)
    tasks[idx] = { ...task, status: 'in_progress', started_at: new Date().toISOString() }
    return HttpResponse.json({ data: { session_id: nanoid() } }, { status: 201 })
  }),
]
