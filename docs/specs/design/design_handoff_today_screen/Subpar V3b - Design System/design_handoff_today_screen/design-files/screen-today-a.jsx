// Subpar · Today screen redesign · Variant A (faithful structure, system applied)
// Same IA as the source: header → rings → active challenge → today's items → tab bar.
// What's improved:
//   – Forest+citron+sage palette (no red dot)
//   – Empty rings labeled "Day 1" instead of "0%" — celebratory, not scolding
//   – Get Long card uses the system v9 hero treatment with Y5 CTA
//   – Today's items: sage chip + icon, "Start" pill (citron) replaces empty checkbox
//   – Floating dark tab bar from the nav spec

function ScreenTodayA() {
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

  const R = 78, S = 16;
  const C = 2 * Math.PI * R;
  // Ring renders track always; progress only when pct > 0
  const Ring = ({ r, color, track, pct = 0 }) => (
    <>
      <circle cx="100" cy="100" r={r} fill="none" stroke={track} strokeWidth={S}/>
      {pct > 0 && (
        <circle cx="100" cy="100" r={r} fill="none" stroke={color}
                strokeWidth={S} strokeDasharray={`${C * pct} ${C}`}
                strokeLinecap="round" transform="rotate(-90 100 100)"/>
      )}
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
      </svg>

      {/* Header */}
      <div style={{ position: 'relative', padding: '54px 22px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12, color: forest, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.6 }}>● ● ●</span> &nbsp;Thu · May 14
          </div>
          <div style={{ marginTop: 6, fontSize: 50, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            Today
          </div>
          <div style={{ marginTop: 2, fontSize: 13, color: sub, fontWeight: 500 }}>
            Day 1 of build · 3 things to do
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: cream,
          display: 'grid', placeItems: 'center', color: forest,
          boxShadow: '0 4px 12px rgba(29,78,52,0.10)' }}>
          <I.gear width={20} height={20}/>
        </div>
      </div>

      {/* Rings — Day 1 empty state */}
      <div style={{ position: 'relative', margin: '18px 18px 0', background: card, borderRadius: 28,
        padding: '18px 18px', boxShadow: '0 12px 28px rgba(29,78,52,0.10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="144" height="144" viewBox="0 0 200 200">
            <Ring r={R} color={forest} track="#dde9d4" pct={0}/>
            <Ring r={R - 22} color={clay} track={peach} pct={0}/>
            <Ring r={R - 44} color={flax} track="#f3eccd" pct={0}/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase' }}>The Round</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: forest, marginTop: 2 }}>
              Day 1.
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Golf', dot: forest, count: '0 / 2' },
                { label: 'Workouts', dot: clay, count: '0 / 1' },
                { label: 'Lifestyle', dot: flax, count: 'opt.' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: r.dot,
                    boxShadow: `0 0 0 3px ${r.dot}22` }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: 11.5, color: sub, fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace' }}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HERO Challenge — Get Long, Day 1 */}
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

        {/* putting green w/ flag */}
        <svg style={{ position: 'absolute', top: -28, right: -28, opacity: 0.55,
          pointerEvents: 'none' }} width="170" height="170" viewBox="0 0 100 100">
          <ellipse cx="55" cy="58" rx="50" ry="42" fill="#bcdfc6"/>
          <ellipse cx="55" cy="58" rx="50" ry="42" fill="none" stroke="#92cba2" strokeWidth="1.2"/>
          <ellipse cx="42" cy="50" rx="22" ry="14" fill="#d4e8d9" opacity="0.6"/>
          <ellipse cx="62" cy="66" rx="3.2" ry="1.6" fill={forest}/>
          <line x1="62" y1="66" x2="62" y2="20" stroke={forest} strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M62 22 L82 27 L62 33 Z" fill={citron}/>
          <circle cx="28" cy="78" r="1.5" fill={forest} opacity="0.7"/>
        </svg>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
            background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>
            <I.flagFill width={11} height={11}/>
            ACTIVE
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.78 }}>Day 1 / 30</div>
        </div>

        <div style={{ position: 'relative', marginTop: 12, fontSize: 44, fontWeight: 800,
          letterSpacing: '-0.035em', lineHeight: 0.95 }}>
          Get Long.
        </div>
        <div style={{ position: 'relative', marginTop: 4, fontSize: 13, opacity: 0.78, fontWeight: 500 }}>
          12 sessions · Speed + power for the driver
        </div>

        {/* segmented 12 — all dim (Day 1) */}
        <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 4 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 4,
              background: 'rgba(255,255,255,0.15)' }}/>
          ))}
        </div>
        <div style={{ position: 'relative', marginTop: 10, display: 'flex', justifyContent: 'space-between',
          fontSize: 12, fontWeight: 600 }}>
          <span><span style={{ color: citron, fontWeight: 800 }}>0</span><span style={{ opacity: 0.7 }}>/12 sessions</span></span>
          <span style={{ opacity: 0.78 }}>29 days left</span>
          <span style={{ color: citron, fontWeight: 700 }}>Begins today</span>
        </div>

        {/* CTA — Y5 solid-glow */}
        <button style={{ marginTop: 14, width: '100%', padding: '14px', borderRadius: 16, border: 'none',
          background: citron, color: greenDeep, fontWeight: 800, fontSize: 14,
          fontFamily: '"Outfit", system-ui, sans-serif',
          letterSpacing: '-0.01em', cursor: 'pointer',
          boxShadow: `0 8px 18px ${citron}55, 0 0 0 4px ${citron}1f`,
          position: 'relative' }}>
          Start today's session →
        </button>
      </div>

      {/* Section: Golf */}
      <SectionHeader title="Golf" count="0 / 2" hint={null}/>
      <div style={{ position: 'relative', padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ItemRow icon={<I.bolt width={14} height={14}/>}
          iconBg={sageLight} iconColor={forest}
          name="Speed Training" meta="6 × 3 sets · L / R"/>
        <ItemRow icon={<I.tee width={14} height={14}/>}
          iconBg={sageLight} iconColor={forest}
          name="Driver" meta="6 × 3 sets · L / R"/>
      </div>

      {/* Section: Workouts */}
      <SectionHeader title="Workouts" count="0 / 1" hint={null}/>
      <div style={{ position: 'relative', padding: '0 18px 12px' }}>
        <ItemRow icon={<I.dumbbell width={14} height={14}/>}
          iconBg={peach} iconColor={clay}
          name="Strength Training" meta="4 sets · 8 reps"/>
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

  // ── Helpers ────────────────────────────────────────────────
  function SectionHeader({ title, count, hint }) {
    return (
      <div style={{ position: 'relative', padding: '18px 24px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</span>
          <span style={{ fontSize: 12, color: sub, fontWeight: 600,
            fontFamily: '"JetBrains Mono", monospace' }}>· {count}</span>
        </div>
        {hint && <span style={{ fontSize: 11, color: sub, fontWeight: 700 }}>{hint}</span>}
      </div>
    );
  }

  function ItemRow({ icon, iconBg, iconColor, name, meta }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        background: card, borderRadius: 22, boxShadow: '0 4px 14px rgba(29,78,52,0.06)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: iconBg,
          display: 'grid', placeItems: 'center', color: iconColor }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: ink, letterSpacing: '-0.01em' }}>{name}</div>
          <div style={{ fontSize: 11.5, color: sub, marginTop: 1, fontWeight: 500 }}>{meta}</div>
        </div>
        {/* "Start" pill — replaces empty checkbox; clearer affordance */}
        <button style={{ background: citron, color: forest,
          fontFamily: '"Outfit", system-ui, sans-serif',
          fontWeight: 800, fontSize: 12, letterSpacing: '-0.005em',
          padding: '7px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
          boxShadow: `0 3px 10px ${citron}55`,
          display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Start
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    );
  }
}

window.ScreenTodayA = ScreenTodayA;
