import type { Task } from '../../types/api'

interface Props {
  byQuadrant: Record<string, Task[]>
  lang: string
}

// Re-use QuadrantBox logic from QuadrantGrid but with big layout
// For hybrid: Q1 big left + Q2/Q3/Q4 stacked right
const Q_META = {
  Q1: { color: 'var(--q1-color)', bg: 'rgba(255, 107, 107, 0.04)', labelEn: 'Do First', labelZh: '立即做', subEn: 'Urgent & Important', subZh: '重要 · 紧急' },
  Q2: { color: 'var(--q2-color)', bg: 'rgba(168, 230, 75, 0.03)', labelEn: 'Schedule', labelZh: '安排做', subEn: 'Important, Not Urgent', subZh: '重要 · 不紧急' },
  Q3: { color: 'var(--q3-color)', bg: 'rgba(91, 200, 212, 0.03)', labelEn: 'Delegate', labelZh: '委托做', subEn: 'Urgent, Not Important', subZh: '紧急 · 不重要' },
  Q4: { color: 'var(--q4-color)', bg: 'rgba(107, 126, 120, 0.03)', labelEn: 'Drop', labelZh: '减少做', subEn: 'Not Urgent, Not Important', subZh: '不紧急 · 不重要' },
} as const

function MatrixCard({ task, lang }: { task: Task; lang: string }) {
  const title = lang === 'zh' ? (task.title.zh ?? task.title.en) : task.title.en
  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: 8,
      cursor: 'default',
      transition: 'all 120ms var(--ease-default)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <button style={{
          width: 14, height: 14, borderRadius: '50%',
          border: '1.5px solid var(--border-strong)',
          background: 'transparent', marginTop: 2,
          flexShrink: 0, cursor: 'default',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
            {title}
          </div>
          <div style={{
            display: 'flex', gap: 10, marginTop: 6, alignItems: 'center',
            fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums',
          }}>
            {task.due_date && <span>{task.due_date}</span>}
            {task.estimated_mins && <span>· {task.estimated_mins}m</span>}
            {task.estimated_pomos > 0 && (
              <span style={{ marginLeft: 'auto' }} className="pip">
                {Array.from({ length: task.estimated_pomos }).map((_, i) => (
                  <i key={i} className={i < task.actual_pomos ? 'on' : ''} />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuadrantPane({ q, tasks, lang }: { q: keyof typeof Q_META; tasks: Task[]; lang: string }) {
  const meta = Q_META[q]
  const label = lang === 'zh' ? meta.labelZh : meta.labelEn
  const sub = lang === 'zh' ? meta.subZh : meta.subEn

  return (
    <div style={{
      background: meta.bg,
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: 14,
      display: 'flex', flexDirection: 'column',
      minHeight: 0,
      position: 'relative',
      transition: 'all 160ms var(--ease-default)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 14, right: 14, height: 2,
        background: meta.color, opacity: 0.7, borderRadius: 2,
      }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
          {tasks.length}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>{sub}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0, overflow: 'auto' }}>
        {tasks.map(task => <MatrixCard key={task.id} task={task} lang={lang} />)}
        {tasks.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-faint)', padding: '4px 0' }}>
            {lang === 'zh' ? '暂无任务' : 'Empty'}
          </div>
        )}
      </div>
    </div>
  )
}

export function MatrixHybrid({ byQuadrant, lang }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 12, flex: 1, minHeight: 0,
    }}>
      <QuadrantPane q="Q1" tasks={byQuadrant.Q1 ?? []} lang={lang} />
      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 12, minHeight: 0 }}>
        <QuadrantPane q="Q2" tasks={byQuadrant.Q2 ?? []} lang={lang} />
        <QuadrantPane q="Q3" tasks={byQuadrant.Q3 ?? []} lang={lang} />
        <QuadrantPane q="Q4" tasks={byQuadrant.Q4 ?? []} lang={lang} />
      </div>
    </div>
  )
}
