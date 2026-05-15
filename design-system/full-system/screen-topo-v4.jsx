// Style 8d — Course Topography v4
// Same as v3 but with the G10 (lightest green, #e1eee4) page background.

function ScreenTopoV4() {
  const ink = '#0e2118';
  const sub = '#5d6e64';
  const forest = '#1d4e34';
  const grass = '#2f7a4d';
  const citron = '#cfde50';
  const clay = '#cc6f4a';
  const flax = '#e6c772';
  const cream = '#fbf6e6';
  const bg = '#e1eee4';   // G10 — lightest green from the swatch palette
  const card = '#ffffff';

  const R = 78, S = 16;
  const C = 2 * Math.PI * R;
  const Ring = ({ r, color, track, pct = 1 }) => (
    <>
      <circle cx="100" cy="100" r={r} fill="none" stroke={track} strokeWidth={S}/>
      <circle cx="100" cy="100" r={r} fill="none" stroke={color}
              strokeWidth={S} strokeDasharray={`${C * pct} ${C}`}
              strokeLinecap="round" transform="rotate(-90 100 100)"/>
    </>
  );

  return (
    <div style={{ height: '100%', color: ink, background: bg,
      fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Topography contour SVG */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 390 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#9eb59a" strokeWidth="0.9">
          <path d="M-50 120 C 80 60, 220 200, 460 100"/>
          <path d="M-50 160 C 80 100, 220 240, 460 140"/>
          <path d="M-50 200 C 80 140, 220 280, 460 180"/>
          <path d="M-50 260 C 100 200, 240 360, 460 260"/>
          <path d="M-50 320 C 120 260, 260 420, 460 330"/>
          <path d="M-50 420 C 80 350, 260 520, 460 430"/>
          <path d="M-50 500 C 100 440, 280 600, 460 510"/>
          <path d="M-50 580 C 120 520, 280 680, 460 600"/>
          <path d="M-50 660 C 90 600, 260 760, 460 680"/>
          <path d="M-50 740 C 80 690, 260 830, 460 760"/>
        </g>
        {/* dots for flag positions */}
        <g fill="#7d9379" opacity="0.5">
          <circle cx="60" cy="220" r="1.4"/>
          <circle cx="320" cy="320" r="1.4"/>
          <circle cx="100" cy="540" r="1.4"/>
          <circle cx="290" cy="640" r="1.4"/>
        </g>
      </svg>

      {/* Header */}
      <div style={{ position: 'relative', padding: '54px 22px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12, color: forest, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.6 }}>● ● ●</span> &nbsp;Wed · May 13
          </div>
          <div style={{ marginTop: 6, fontSize: 50, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            Today
          </div>
          <div style={{ marginTop: 2, fontSize: 13, color: sub, fontWeight: 500 }}>
            Round 12 · Week 2 of build
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: cream,
          display: 'grid', placeItems: 'center', color: forest,
          boxShadow: '0 4px 12px rgba(29,78,52,0.10)' }}>
          <I.gear width={20} height={20}/>
        </div>
      </div>

      {/* Rings — bold card */}
      <div style={{ position: 'relative', margin: '18px 18px 0', background: card, borderRadius: 28,
        padding: '18px 18px', boxShadow: '0 12px 28px rgba(29,78,52,0.10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="144" height="144" viewBox="0 0 200 200">
            <Ring r={R} color={forest} track="#dde9d4"/>
            <Ring r={R - 22} color={clay} track="#f1d9cc"/>
            <Ring r={R - 44} color={flax} track="#f3eccd"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase' }}>The Round</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: forest, marginTop: 2 }}>
              Cleared.
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Golf', dot: forest },
                { label: 'Workouts', dot: clay },
                { label: 'Lifestyle', dot: flax },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: r.dot,
                    boxShadow: `0 0 0 3px ${r.dot}22` }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: 11.5, color: forest, fontWeight: 700 }}>● Done</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HERO Challenge — forest with putting-green-with-flag decoration */}
      <div style={{ position: 'relative', margin: '14px 18px 0', borderRadius: 28, overflow: 'hidden',
        background: forest, color: cream, padding: '20px 22px 22px',
        boxShadow: `0 16px 34px rgba(29,78,52,0.30)` }}>
        {/* inner topo lines */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
             width="100%" height="100%" viewBox="0 0 350 260" preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke={citron} strokeWidth="0.8">
            <path d="M-20 50 C 80 25, 200 90, 380 40"/>
            <path d="M-20 90 C 80 65, 200 140, 380 80"/>
            <path d="M-20 140 C 80 115, 200 200, 380 130"/>
            <path d="M-20 200 C 80 175, 200 250, 380 190"/>
          </g>
        </svg>

        {/* putting green w/ flag — faded into background, top-right */}
        <svg style={{ position: 'absolute', top: -28, right: -28, opacity: 0.55,
          pointerEvents: 'none' }} width="170" height="170" viewBox="0 0 100 100">
          {/* the green (slight ellipse for perspective) */}
          <ellipse cx="55" cy="58" rx="50" ry="42" fill="#bcdfc6"/>
          {/* fringe ring */}
          <ellipse cx="55" cy="58" rx="50" ry="42" fill="none" stroke="#92cba2" strokeWidth="1.2"/>
          {/* lighter highlight on green */}
          <ellipse cx="42" cy="50" rx="22" ry="14" fill="#d4e8d9" opacity="0.6"/>
          {/* cup hole */}
          <ellipse cx="62" cy="66" rx="3.2" ry="1.6" fill={forest}/>
          {/* flag pole */}
          <line x1="62" y1="66" x2="62" y2="20" stroke={forest} strokeWidth="1.3" strokeLinecap="round"/>
          {/* flag */}
          <path d="M62 22 L82 27 L62 33 Z" fill={citron}/>
          {/* tee marker dot */}
          <circle cx="28" cy="78" r="1.5" fill={forest} opacity="0.7"/>
        </svg>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
            <I.flagFill width={11} height={11}/>
            ACTIVE · HOLE 1
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Day 1 / 30</div>
        </div>

        <div style={{ position: 'relative', marginTop: 12, fontSize: 44, fontWeight: 800,
          letterSpacing: '-0.035em', lineHeight: 0.95 }}>
          Get Long.
        </div>
        <div style={{ position: 'relative', marginTop: 4, fontSize: 13, opacity: 0.78, fontWeight: 500 }}>
          12 sessions · Speed + power for the driver
        </div>

        {/* metric strip */}
        <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pace</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: citron, marginTop: 2, lineHeight: 1 }}>+2 mph</div>
          </div>
          <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>Fri · session 2</div>
          </div>
        </div>

        {/* segmented + citron */}
        <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 4 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 4,
              background: i < 1 ? citron : 'rgba(255,255,255,0.15)',
              boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
          ))}
        </div>
        <div style={{ position: 'relative', marginTop: 10, display: 'flex', justifyContent: 'space-between',
          fontSize: 12, fontWeight: 600 }}>
          <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.7 }}>/12 sessions</span></span>
          <span style={{ opacity: 0.78 }}>29 days left</span>
          <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
        </div>
      </div>

      {/* Section: Golf */}
      <div style={{ position: 'relative', padding: '18px 24px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Golf</span>
          <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>· 2 / 2</span>
        </div>
        <span style={{ fontSize: 11, color: forest, fontWeight: 700,
          background: cream, padding: '3px 10px', borderRadius: 99 }}>● COMPLETE</span>
      </div>

      <div style={{ position: 'relative', padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: <I.bolt width={14} height={14}/>, name: 'Speed Sticks', meta: '6 × 3 · L/R' },
          { icon: <I.tee width={14} height={14}/>, name: 'Driver', meta: '6 × 3 · L/R' },
        ].map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
            background: card, borderRadius: 22, boxShadow: '0 4px 14px rgba(29,78,52,0.06)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: '#dde9d4',
              display: 'grid', placeItems: 'center', color: forest }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, textDecoration: 'line-through',
                textDecorationColor: '#9fb8a4', color: sub, letterSpacing: '-0.01em' }}>{item.name}</div>
              <div style={{ fontSize: 11.5, color: sub, marginTop: 1, fontWeight: 500 }}>{item.meta}</div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: forest,
              display: 'grid', placeItems: 'center', color: citron }}>
              <I.check width={14} height={14}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', padding: '14px 24px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Workouts</span>
          <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>· 1 / 1</span>
        </div>
        <span style={{ fontSize: 11, color: clay, fontWeight: 700,
          background: cream, padding: '3px 10px', borderRadius: 99 }}>● COMPLETE</span>
      </div>

      <div style={{ position: 'relative', padding: '0 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
          background: card, borderRadius: 22, boxShadow: '0 4px 14px rgba(29,78,52,0.06)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#f1d9cc',
            display: 'grid', placeItems: 'center', color: clay }}>
            <I.dumbbell width={14} height={14}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, textDecoration: 'line-through',
              textDecorationColor: '#d3a994', color: sub }}>Rotational Power</div>
            <div style={{ fontSize: 11.5, color: sub, marginTop: 1, fontWeight: 500 }}>4 sets · 8 reps</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: clay,
            display: 'grid', placeItems: 'center', color: cream }}>
            <I.check width={14} height={14}/>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Floating dark tab bar */}
      <div style={{ position: 'relative', padding: '6px 18px 24px' }}>
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
}

window.ScreenTopoV4 = ScreenTopoV4;
