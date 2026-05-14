import { http, HttpResponse } from 'msw'
import { nanoid } from 'nanoid'

export const aiHandlers = [
  http.post('/api/v1/ai/recommend', () => {
    return HttpResponse.json({
      data: {
        task: {
          id: 'task-1',
          title: { en: 'Finalize Q3 product roadmap', zh: '完成 Q3 产品路线图' },
          status: 'pending',
          quadrant: 'Q1',
          priority: 'urgent',
          today: true,
          actual_mins: 0,
          estimated_pomos: 2,
          actual_pomos: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        reason: {
          en: 'This is due today and directly blocks the engineering sprint. Highest leverage task in your queue.',
          zh: '今天截止，直接阻塞工程冲刺。是你任务队列中杠杆率最高的任务。',
        },
        conviction: 0.92,
        not_now: [
          {
            task_id: 'task-2',
            reason: {
              en: 'Important but flexible deadline — best done after the roadmap.',
              zh: '重要但截止时间灵活——最好在路线图完成后再做。',
            },
          },
        ],
      },
    })
  }),

  http.post('/api/v1/ai/classify', async ({ request }) => {
    const body = await request.json() as { task_ids: string[] }
    const results = (body.task_ids ?? []).map((id: string, i: number) => ({
      task_id: id,
      suggested_quadrant: (['Q1', 'Q2', 'Q3', 'Q4'] as const)[i % 4],
      reason: {
        en: 'Based on urgency signals and impact keywords in the task title.',
        zh: '根据任务标题中的紧迫性信号和影响关键词判断。',
      },
    }))
    return HttpResponse.json({ data: results })
  }),

  http.post('/api/v1/ai/test-connection', async () => {
    await new Promise(r => setTimeout(r, 800))
    return HttpResponse.json({ data: { ok: true, latency_ms: 312 } })
  }),

  http.post('/api/v1/ai/parse', async ({ request }) => {
    const body = await request.json() as { input: string }
    const input = body.input ?? ''
    return HttpResponse.json({
      data: {
        title: input,
        quadrant: input.toLowerCase().includes('urgent') ? 'Q1' : 'Q2',
        priority: input.toLowerCase().includes('urgent') ? 'urgent' : 'medium',
        estimated_pomos: 1,
        id: nanoid(),
      },
    })
  }),

  http.post('/api/v1/ai/chat', () => {
    return HttpResponse.json({
      data: {
        message: 'I can help you prioritize your tasks. What would you like to work on?',
        session_id: nanoid(),
      },
    })
  }),
]
