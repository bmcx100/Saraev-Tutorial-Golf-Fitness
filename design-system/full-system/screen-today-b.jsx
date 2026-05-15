// Subpar · Today screen redesign · Variant B (action-forward)
// Reworks the IA: instead of rings → challenge → list, leads with the FIRST
// thing to do. Up-next hero, mini ring strip, today's queue as one list.
// Builds on the system: forest/citron, dark tab bar, system rows.

function ScreenTodayB() {
  const ink = '#0e2118';
  const sub = '#5d6e64';
  const forest = '#1d4e34';      // G3
  const greenDeep = '#11371f';   // G2
  const sage = '#bcdfc6';        // G9
  const sageLight = '#dde9d4';
  const citron = '#cfde50';      // Y5
  const clay = '#cc6f4a';
  const flax = '#e6c772';
  const cream = '#fbf6e6';
  const bg = '#e1eee4';          // G10
  const card = '#ffffff';
  const peach = '#f1d9cc';

  // Tiny ring widget for the strip
  const TinyRing = ({ pct, color, track, size = 38, sw = 5 }) => {
    const r = (size - sw) / 2;
    const c = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw}/>
        {pct > 0 && (
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
            strokeWidth={sw} strokeDasharray={`${c*pct} ${c}`}
            strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        )}
      </svg>
    );
  };

  return (
    <div style={{ height: '100%', color: ink, background: bg,
      fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Topography contour SVG */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 390 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#9eb59a" strokeWidth="0.9">
          <path d="M-50 120 C 80 60, 220 200, 460 100"/>
          <path d="M-50 200 C 80 140, 220 280, 460 180"/>
          <path d="M-50 320 C 120 260, 260 420, 460 330"/>
          <path d="M-50 500 C 100 440, 280 600, 460 510"/>
          <path d="M-50 660 C 90 600, 260 760, 460 680"/>
          <path d="M-50 740 C 80 690, 260 830, 460 760"/>
        </g>
      </svg>

      {/* Compact header */}
      <div style={{ position: 'relative', padding: '54px 22px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11.5, color: forest, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase' }}>
            Thu · May 14 · Day 1
          </div>
          <div style={{ marginTop: 2, fontSize: 32, fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 1 }}>
            Today
          </div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: cream,
          display: 'grid', placeItems: 'center', color: forest,
          boxShadow: '0 4px 12px rgba(29,78,52,0.10)' }}>
          <I.gear width={18} height={18}/>
        </div>
      </div>

      {/* Mini ring strip — demoted from main UI */}
      <div style={{ position: 'relative', margin: '14px 18px 0', background: card, borderRadius: 22,
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 22px rgba(29,78,52,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TinyRing pct={0} color={forest} track={sageLight}/>
          <TinyRing pct={0} color={clay} track={peach}/>
          <TinyRing pct={0} color={flax} track="#f3eccd"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: sub, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase' }}>The Round</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: forest, letterSpacing: '-0.015em',
            marginTop: 1 }}>
            3 left today
          </div>
        </div>
        <span style={{ fontSize: 11, color: forest, fontWeight: 700,
          fontFamily: '"JetBrains Mono", monospace' }}>0 / 3</span>
      </div>

      {/* HERO — Up Next */}
      <div style={{ position: 'relative', margin: '14px 18px 0', borderRadius: 28, overflow: 'hidden',
        background: `linear-gradient(135deg, ${forest} 0%, ${greenDeep} 100%)`, color: cream,
        padding: '20px 22px 22px',
        boxShadow: `0 16px 34px rgba(29,78,52,0.30), inset 0 1px 0 rgba(255,255,255,0.06)` }}>
        {/* inner topo lines */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
             width="100%" height="100%" viewBox="0 0 350 280" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke={citron} strokeWidth="0.8">
            <path d="M-20 50 C 80 25, 200 90, 380 40"/>
            <path d="M-20 90 C 80 65, 200 140, 380 80"/>
            <path d="M-20 140 C 80 115, 200 200, 380 130"/>
            <path d="M-20 200 C 80 175, 200 250, 380 190"/>
          </g>
        </svg>

        {/* Ball-tracer arcing from bottom-left to top-right */}
        <svg style={{ position: 'absolute', top: -16, right: 0,
          width: 360, height: 200, pointerEvents: 'none' }}
          viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke="#92cba2" strokeWidth="6"
                strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
          <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke="#92cba2" strokeWidth="2.2"
                strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
          <path d="M 4 91 Q 93 3, 196 26" fill="none" stroke="#92cba2" strokeWidth="1.3"
                strokeLinecap="round" opacity="0.62" strokeDasharray="3 7"
                vectorEffect="non-scaling-stroke"/>
          <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke="#92cba2" strokeWidth="1.2"
                strokeLinecap="round" opacity="0.55" strokeDasharray="2 5"
                vectorEffect="non-scaling-stroke"/>
        </svg>

        <div style={{ position: 'relative', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            background: citron, color: greenDeep, padding: '4px 10px', borderRadius: 99,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>
            <I.bolt width={11} height={11}/>
            UP NEXT · 12 MIN
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.78,
            fontFamily: '"JetBrains Mono", monospace' }}>1 of 3</div>
        </div>

        <div style={{ position: 'relative', marginTop: 14, fontSize: 44, fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 0.92 }}>
          Speed Training.
        </div>
        <div style={{ position: 'relative', marginTop: 4, fontSize: 13, fontWeight: 500, opacity: 0.7 }}>
          6 × 3 sets · L / R · part of <em>Get Long</em>
        </div>

        {/* Get Long mini progress */}
        <div style={{ position: 'relative', marginTop: 16, padding: '10px 12px', borderRadius: 14,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <I.flagFill width={14} height={14} style={{ color: citron }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.65, letterSpacing: '0.06em',
              textTransform: 'uppercase' }}>Get Long · session 1 / 12</div>
            <div style={{ marginTop: 5, display: 'flex', gap: 3 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 3,
                  background: 'rgba(255,255,255,0.12)' }}/>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: citron,
            fontFamily: '"JetBrains Mono", monospace' }}>29d</span>
        </div>

        {/* CTA */}
        <button style={{ position: 'relative', marginTop: 16, width: '100%', padding: '16px',
          borderRadius: 16, border: 'none',
          background: citron, color: greenDeep, fontWeight: 800, fontSize: 16,
          fontFamily: '"Outfit", system-ui, sans-serif',
          letterSpacing: '-0.01em', cursor: 'pointer',
          boxShadow: `0 10px 22px ${citron}55, 0 0 0 4px ${citron}1f`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Start now
        </button>
      </div>

      {/* Today's queue header */}
      <div style={{ position: 'relative', padding: '20px 24px 8px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Today's queue</span>
        <span style={{ fontSize: 11.5, color: sub, fontWeight: 700,
          fontFamily: '"JetBrains Mono", monospace' }}>3 items</span>
      </div>

      {/* Combined queue */}
      <div style={{ position: 'relative', padding: '0 18px', display: 'flex',
        flexDirection: 'column', gap: 8 }}>
        <QueueRow n="01" icon={<I.bolt width={14} height={14}/>}
          chipBg={citron} chipFg={greenDeep}
          name="Speed Training" meta="6 × 3 sets · L / R · 12 min"
          cta="Up next"/>
        <QueueRow n="02" icon={<I.tee width={14} height={14}/>}
          chipBg={sageLight} chipFg={forest}
          name="Driver" meta="6 × 3 sets · L / R · 15 min"
          cta="Queued"/>
        <QueueRow n="03" icon={<I.dumbbell width={14} height={14}/>}
          chipBg={peach} chipFg={clay}
          name="Strength Training" meta="4 sets · 8 reps · 22 min"
          cta="Queued"/>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Floating dark tab bar */}
      <div style={{ position: 'relative', padding: '14px 18px 24px' }}>
        <div style={{ background: forest, borderRadius: 30, padding: 6, display: 'flex', gap: 4,
          boxShadow: '0 14px 30px rgba(29,78,52,0.30)' }}>
          {[
            { label: 'Today', icon: <I.checkCircle width={18} height={18}/>, active: true },
            { label: 'Challenges', icon: <I.flag width={18} height={18}/> },
            { label: 'Stats', icon: <I.bars width={18} height={18}/> },
          ].map(t => (
            <div key={t.label} style={{ flex: t.active ? 1.4 : 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 24,
              background: t.active ? citron : 'transparent',
              color: t.active ? forest : 'rgba(251,246,230,0.65)',
              fontWeight: t.active ? 800 : 600, fontSize: 13 }}>
              {t.icon}
              {t.active && <span>{t.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function QueueRow({ n, icon, chipBg, chipFg, name, meta, cta }) {
    const isUpNext = cta === 'Up next';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 12px 12px',
        background: card, borderRadius: 22,
        boxShadow: '0 4px 14px rgba(29,78,52,0.06)',
        outline: isUpNext ? `2px solid ${citron}` : 'none',
        outlineOffset: isUpNext ? '-2px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: sub, fontWeight: 700,
            fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em' }}>{n}</span>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: chipBg,
            display: 'grid', placeItems: 'center', color: chipFg }}>{icon}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: ink, letterSpacing: '-0.01em' }}>{name}</div>
          <div style={{ fontSize: 11.5, color: sub, marginTop: 1, fontWeight: 500 }}>{meta}</div>
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isUpNext ? greenDeep : sub,
          background: isUpNext ? citron : 'transparent',
          padding: isUpNext ? '4px 9px' : '4px 0', borderRadius: 99 }}>
          {cta}
        </div>
      </div>
    );
  }
}

window.ScreenTodayB = ScreenTodayB;
