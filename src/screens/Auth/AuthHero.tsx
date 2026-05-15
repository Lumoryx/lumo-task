export function AuthHero() {
  const circumference = 2 * Math.PI * 110

  return (
    <div style={{
      width: 460, flexShrink: 0,
      background: `
        radial-gradient(70% 70% at 30% 30%, rgba(61, 255, 160, 0.07), transparent 65%),
        radial-gradient(60% 60% at 80% 80%, rgba(91, 200, 212, 0.04), transparent 70%),
        linear-gradient(160deg, #0A100D 0%, #060908 100%)
      `,
      borderRight: '1px solid var(--border-faint)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '32px',
    }}>
      {/* Decorative grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* Centered visual stack */}
      <div style={{
        flex: 1, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Outer glow halo */}
        <div style={{
          position: 'absolute',
          width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
          animation: 'lumoBreath 5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Progress ring SVG */}
        <svg viewBox="0 0 260 260" style={{ width: 260, height: 260, position: 'relative', zIndex: 1 }}>
          <defs>
            <linearGradient id="heroProgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-dim)" />
            </linearGradient>
          </defs>
          <circle cx="130" cy="130" r="110" fill="none"
            stroke="var(--border-default)" strokeWidth="1" opacity="0.6" />
          <circle cx="130" cy="130" r="110" fill="none"
            stroke="url(#heroProgGrad)" strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.32}
            transform="rotate(-90 130 130)"
            style={{ filter: 'drop-shadow(0 0 6px var(--accent-primary))' }} />
          {/* Inner concentric */}
          <circle cx="130" cy="130" r="78" fill="none"
            stroke="var(--accent-edge)" strokeWidth="0.5" opacity="0.5" />
          <circle cx="130" cy="130" r="50" fill="none"
            stroke="var(--accent-edge)" strokeWidth="0.5" opacity="0.35" />
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 2,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--accent-primary)',
            marginBottom: 8, opacity: 0.9,
          }}>Now</div>
          <div style={{
            fontSize: 44, fontWeight: 200,
            fontFamily: 'var(--font-mono)', lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
          }}>18:42</div>
          <div style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
            color: 'var(--text-muted)', marginTop: 10, textTransform: 'uppercase',
          }}>2 / 4 · Q1</div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 18, fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.45, letterSpacing: '-0.01em',
        }}>
          Know what to do in 10 seconds — then begin with one tap.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          {[
            'AI picks one task that matters most',
            'One pomodoro at a time',
            'Data stays on your device',
          ].map((line, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--accent-primary)' }} />
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
