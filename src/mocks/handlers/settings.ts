import { http, HttpResponse } from 'msw'
import { seedSettings, seedAIConfig } from '../seed'
import type { AppSettings } from '../../types/api'

let settings = { ...seedSettings }
let aiConfig = { ...seedAIConfig }

export const settingsHandlers = [
  http.get('/api/v1/settings', () => {
    return HttpResponse.json({ data: settings })
  }),

  http.put('/api/v1/settings/:key', async ({ params, request }) => {
    const body = await request.json() as { value: unknown }
    const key = params.key as keyof AppSettings
    settings = { ...settings, [key]: body.value }
    return HttpResponse.json({ data: settings })
  }),

  http.get('/api/v1/settings/ai', () => {
    return HttpResponse.json({ data: aiConfig })
  }),

  http.put('/api/v1/settings/ai', async ({ request }) => {
    const body = await request.json() as Partial<typeof aiConfig>
    aiConfig = { ...aiConfig, ...body }
    if (body.api_key_masked !== undefined) {
      aiConfig.api_key_masked = '••••••••••••' + (body.api_key_masked ?? '').slice(-6)
    }
    return HttpResponse.json({ data: aiConfig })
  }),

  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (!body.email) return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    return HttpResponse.json({
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 'user-1', email: body.email, name: 'Demo User', created_at: new Date().toISOString() },
      },
    })
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; name: string; password: string }
    return HttpResponse.json({
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 'user-1', email: body.email, name: body.name, created_at: new Date().toISOString() },
      },
    }, { status: 201 })
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ data: { ok: true } })
  }),

  http.get('/api/v1/auth/me', () => {
    return HttpResponse.json({
      data: { id: 'user-1', email: 'demo@lumo.app', name: 'Demo User', created_at: new Date().toISOString() },
    })
  }),
]
