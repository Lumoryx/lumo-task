interface Props {
  size?: number
  color?: string
}

export function LumoGlyph({ size = 24, color = 'var(--accent)' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="16" cy="16" r="8" fill={color} opacity="0.15" />
      <circle cx="16" cy="16" r="4" fill={color} />
      <circle cx="16" cy="6" r="2" fill={color} opacity="0.6" />
      <circle cx="24.9" cy="11" r="2" fill={color} opacity="0.5" />
      <circle cx="24.9" cy="21" r="2" fill={color} opacity="0.4" />
      <circle cx="16" cy="26" r="2" fill={color} opacity="0.3" />
      <circle cx="7.1" cy="21" r="2" fill={color} opacity="0.4" />
      <circle cx="7.1" cy="11" r="2" fill={color} opacity="0.5" />
    </svg>
  )
}
