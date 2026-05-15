import type { Task } from '../../types/api'

const Q_META = {
  Q1: { color: 'var(--q1-color)', labelEn: 'Q1 · Do First', labelZh: 'Q1 · 立即做', subEn: 'Urgent & Important', subZh: '重要 · 紧急' },
  Q2: { color: 'var(--q2-color)', labelEn: 'Q2 · Schedule', labelZh: 'Q2 · 安排做', subEn: 'Important, Not Urgent', subZh: '重要 · 不紧急' },
  Q3: { color: 'var(--q3-color)', labelEn: 'Q3 · Delegate', labelZh: 'Q3 · 委托做', subEn: 'Urgent, Not Important', subZh: '紧急 · 不重要' },
  Q4: { color: 'var(--q4-color)', labelEn: 'Q4 · Drop', labelZh: 'Q4 · 减少做', subEn: 'Not Urgent, Not Important', subZh: '不紧急 · 不重要' },
} as const

interface Props {
  byQuadrant: Record<string, Task[]>
  lang: string
}

function TaskRow({ task, lang }: { task: Task; lang: string }) {
  const title = lang === 'zh' ? (task.title.zh ?? task.title.en) : task.title.en
  return (
    <div style={{
      padding: '10px 0 10px 18px',
      borderBottom: '1px solid var(--border-faint)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button style={{
        width: 14, height: 14, borderRadius: '50%',
        border: '1.5px solid var(--border-strong)',
        background: 'transparent', flexShrink: 0, cursor: 'default',
      }} />
      <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{title}</span>
      {task.due_date && (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{task.due_date}</span>
      )}
      {task.estimated_pomos > 0 && (
        <span className="pip">
          {Array.from({ length: task.estimated_pomos }).map((_, i) => (
            <i key={i} className={i < task.actual_pomos ? 'on' : ''} />
          ))}
        </span>
      )}
    </div>
  )
}

export function MatrixList({ byQuadrant, lang }: Props) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', paddingRight: 8 }}>
      {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => {
        const meta = Q_META[q]
        const items = byQuadrant[q] ?? []
        const label = lang === 'zh' ? meta.labelZh : meta.labelEn
        const sub = lang === 'zh' ? meta.subZh : meta.subEn
        return (
          <div key={q} style={{ marginBottom: 18 }}>
            {/* Sticky header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: '1px solid var(--border-faint)',
              position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 1,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: meta.color }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>{label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{items.length}</span>
            </div>
            {items.map(task => <TaskRow key={task.id} task={task} lang={lang} />)}
            {items.length === 0 && (
              <div style={{ padding: '12px 0 12px 18px', fontSize: 12, color: 'var(--text-faint)' }}>
                {lang === 'zh' ? '暂无任务' : 'Empty'}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
