import type { AIVariant } from '../../types/ui'

interface Props {
  variant?: AIVariant
  text?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

export function LumoStatus({ variant = 'dot', text, label }: Props) {
  const displayText = text ?? label

  if (variant === 'orb') {
    return (
      <div className="lumo-bar">
        <div className="lumo-orb">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>
        {displayText && <span>{displayText}</span>}
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className="lumo-bar">
        <span
          className="lumo-text"
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            fontWeight: 500,
          }}
        >
          LUMO
        </span>
        <span style={{ color: 'var(--text-faint)' }}>·</span>
        {displayText && <span className="lumo-text">{displayText}</span>}
      </div>
    )
  }

  // default: dot variant
  return (
    <div className="lumo-bar">
      <span className="lumo-glyph">
        <span className="halo" />
        <span className="core" />
      </span>
      {displayText && <span>{displayText}</span>}
    </div>
  )
}
