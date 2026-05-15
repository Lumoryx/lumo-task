interface Props {
  size?: number
}

export function LumoGlyph({ size = 22 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="lumoGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-primary)" />
          <stop offset="100%" stopColor="var(--accent-dim)" />
        </radialGradient>
      </defs>
      <circle
        cx="12" cy="12" r="9"
        fill="none"
        stroke="var(--accent-primary)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <circle cx="12" cy="12" r="4.5" fill="url(#lumoGrad)" />
      <circle cx="12" cy="12" r="2" fill="var(--bg-base)" />
    </svg>
  )
}
