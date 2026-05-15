// "Get Long" Speed card · v9 — all sizes combined from v8 + v6
// Cropped (XS) + Compact (S) are lifted straight from GLS8 (bottom-visible
// dotted removed in each). Standard (M), Detailed (L), and Full/Expanded (XL)
// are lifted straight from GLS6 (full 4-line tracer set). Nothing is changed.

function GetLongSpeedSizesV9() {
  const greenDeep = '#11371f';   // G2
  const green = '#1d4e34';       // G3
  const citron = '#cfde50';      // Y5
  const g8 = '#92cba2';          // G8 — tracer lines
  const cream = '#fbf6e6';
  const ink = '#10241a';
  const sub = '#6b756f';

  const TRACER_W = 420;
  const TRACER_H = 335;

  // ───────────────────────────────────────────────────────────
  // Tracer variants (each card slot picks one — geometry untouched)
  // ───────────────────────────────────────────────────────────

  // From GLS6: full 4-line tracer set — used by M/L/XL (no lift)
  const BallTracersFull = ({ lift = 0 }) => (
    <svg
      style={{ position: 'absolute', top: -lift, right: 0,
        width: TRACER_W, height: TRACER_H,
        pointerEvents: 'none' }}
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Solid (green) — highest arc */}
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
            strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
            strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      {/* Bottom dotted (y=35) */}
      <path d="M 4 94 Q 80 12, 196 35" fill="none" stroke={g8} strokeWidth="1.4"
            strokeLinecap="round" opacity="0.7"
            strokeDasharray="3 6" vectorEffect="non-scaling-stroke"/>
      {/* Middle dotted (y=26) */}
      <path d="M 4 91 Q 93 3, 196 26" fill="none" stroke={g8} strokeWidth="1.3"
            strokeLinecap="round" opacity="0.62"
            strokeDasharray="3 7" vectorEffect="non-scaling-stroke"/>
      {/* Upper dotted (y=21) */}
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
            strokeLinecap="round" opacity="0.55"
            strokeDasharray="2 5" vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  // From GLS8 Compact: bottom dotted (y=35) removed
  const BallTracersV8Compact = ({ lift = 0 }) => (
    <svg
      style={{ position: 'absolute', top: -lift, right: 0,
        width: TRACER_W, height: TRACER_H,
        pointerEvents: 'none' }}
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
            strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
            strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      {/* (Bottom dotted y=35 removed in v8) */}
      <path d="M 4 91 Q 93 3, 196 26" fill="none" stroke={g8} strokeWidth="1.3"
            strokeLinecap="round" opacity="0.62"
            strokeDasharray="3 7" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
            strokeLinecap="round" opacity="0.55"
            strokeDasharray="2 5" vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  // From GLS8 Cropped: bottom dotted relocated to y=17.5; middle dotted (y=26)
  // removed (the bottom-visible dotted line in cropped).
  const BallTracersV8Cropped = ({ lift = 0 }) => (
    <svg
      style={{ position: 'absolute', top: -lift, right: 0,
        width: TRACER_W, height: TRACER_H,
        pointerEvents: 'none' }}
      viewBox="0 0 200 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Solid (green) */}
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
            strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
            strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      {/* Bottom dotted — moved to between green (y=14) and upper dotted (y=21) */}
      <path d="M 4 88 Q 95 -1, 196 17.5" fill="none" stroke={g8} strokeWidth="1.4"
            strokeLinecap="round" opacity="0.7"
            strokeDasharray="3 6" vectorEffect="non-scaling-stroke"/>
      {/* (Middle dotted y=26 removed in v8 cropped) */}
      {/* Upper dotted */}
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
            strokeLinecap="round" opacity="0.55"
            strokeDasharray="2 5" vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  const cardShell = {
    position: 'relative', borderRadius: 24, overflow: 'hidden',
    background: `linear-gradient(135deg, ${green} 0%, ${greenDeep} 100%)`,
    color: cream,
    boxShadow: `0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
    fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
  };

  const ActivePill = ({ children, size = 11 }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      background: citron, color: greenDeep, padding: size > 11 ? '4px 10px' : '3px 9px',
      borderRadius: 99, fontSize: size, fontWeight: 800 }}>
      <I.bolt width={size} height={size}/>
      {children}
    </div>
  );

  const SpeedReadout = ({ size = 'md' }) => {
    const sz = size === 'sm' ? { num: 22, mph: 10, gap: 2 }
             : size === 'md' ? { num: 32, mph: 11, gap: 3 }
             : { num: 44, mph: 13, gap: 4 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
        <div style={{ fontSize: sz.num, fontWeight: 800, color: citron,
          letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 18px ${citron}66` }}>
          118
        </div>
        <div style={{ marginTop: sz.gap, fontSize: sz.mph, fontWeight: 700,
          letterSpacing: '0.16em', color: 'rgba(251,246,230,0.65)',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          MPH
        </div>
      </div>
    );
  };

  const Label = ({ id, name, h }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 8px 4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        background: ink, color: citron, padding: '3px 8px', borderRadius: 99,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{id}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: ink, letterSpacing: '-0.01em' }}>{name}</div>
      <div style={{ fontSize: 12, color: sub, fontWeight: 500,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{h}</div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S1 · XS — Cropped (from GLS8, lift 31, BallTracersV8Cropped)
  // ───────────────────────────────────────────────────────────
  const S1 = (
    <div style={{ ...cardShell, padding: '12px 16px' }}>
      <BallTracersV8Cropped lift={31}/>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <ActivePill size={10.5}>LIVE</ActivePill>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
          Get Long
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: citron, fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 10px ${citron}55` }}>
          118<span style={{ fontSize: 9.5, color: 'rgba(251,246,230,0.65)', marginLeft: 3, fontWeight: 700,
            letterSpacing: '0.12em', fontFamily: '"JetBrains Mono", monospace' }}>MPH</span>
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S2 · S — Compact (from GLS8, lift 2, BallTracersV8Compact)
  // ───────────────────────────────────────────────────────────
  const S2 = (
    <div style={{ ...cardShell, padding: '14px 18px' }}>
      <BallTracersV8Compact lift={2}/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ActivePill>LIVE</ActivePill>
        <div style={{ fontSize: 11.5, opacity: 0.7, fontWeight: 600 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 6, display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Get Long.
        </div>
        <SpeedReadout size="sm"/>
      </div>
      <div style={{ position: 'relative', marginTop: 10, height: 6,
        background: 'rgba(255,255,255,0.10)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: '8%', height: '100%', background: citron,
          borderRadius: 99, boxShadow: `0 0 10px ${citron}` }}/>
      </div>
      <div style={{ position: 'relative', marginTop: 6, display: 'flex', justifyContent: 'space-between',
        fontSize: 11.5, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.6 }}>/12</span></span>
        <span style={{ opacity: 0.65 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ +2.4 mph</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S3 · M — Standard (from GLS6, no lift, BallTracersFull)
  // ───────────────────────────────────────────────────────────
  const S3 = (
    <div style={{ ...cardShell, padding: '18px 20px', borderRadius: 26 }}>
      <BallTracersFull/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>LIVE · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            Get Long.
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, opacity: 0.65, fontWeight: 500 }}>
            Top clubhead speed · 12 sessions
          </div>
        </div>
        <SpeedReadout size="md"/>
      </div>
      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 9, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.10)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 8, display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.6 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.65 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ +2.4 mph</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S4 · L — Detailed (from GLS6, no lift, BallTracersFull)
  // ───────────────────────────────────────────────────────────
  const S4 = (
    <div style={{ ...cardShell, padding: '20px 22px', borderRadius: 28 }}>
      <BallTracersFull/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>LIVE · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            Get Long.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.65, fontWeight: 500 }}>
            Top clubhead speed · 12 sessions
          </div>
        </div>
        <SpeedReadout size="md"/>
      </div>

      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Top</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: citron, marginTop: 2, lineHeight: 1 }}>118 mph</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Δ Week</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3, lineHeight: 1, color: citron }}>+2.4 mph</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 10, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.10)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 10, display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.6 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.65 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S5 · XL — Full / Expanded (from GLS6, no lift, BallTracersFull)
  // ───────────────────────────────────────────────────────────
  const S5 = (
    <div style={{ ...cardShell, padding: '22px 22px', borderRadius: 30 }}>
      <BallTracersFull/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>LIVE · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>Day 1 / 30 · 4-week plan</div>
      </div>

      <div style={{ position: 'relative', marginTop: 12, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92 }}>
            Get Long.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.65, fontWeight: 500 }}>
            Top clubhead speed · 12 sessions
          </div>
        </div>
        <SpeedReadout size="lg"/>
      </div>

      <div style={{ position: 'relative', marginTop: 16, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Top</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: citron, marginTop: 2, lineHeight: 1 }}>118 mph</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Avg</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>112 mph</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Δ Week</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, lineHeight: 1, color: citron }}>+2.4 mph</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 16, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.10)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 10, display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.6 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.65 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>

      <div style={{ position: 'relative', marginTop: 18, display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none',
          background: citron, color: greenDeep, fontWeight: 800, fontSize: 14, cursor: 'pointer',
          letterSpacing: '-0.01em', boxShadow: `0 8px 18px ${citron}55, 0 0 0 4px ${citron}1f` }}>
          Start session 2 →
        </button>
        <button style={{ padding: '14px 18px', borderRadius: 16,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
          color: cream, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Plan
        </button>
      </div>
    </div>
  );

  const items = [
    { id: 'GLS9-XS', name: 'Cropped (from GLS8)',         h: '~64px',  el: S1 },
    { id: 'GLS9-S',  name: 'Compact (from GLS8)',         h: '~140px', el: S2 },
    { id: 'GLS9-M',  name: 'Standard (from GLS6)',        h: '~210px', el: S3 },
    { id: 'GLS9-L',  name: 'Detailed (from GLS6)',        h: '~290px', el: S4 },
    { id: 'GLS9-XL', name: 'Full / Expanded (from GLS6)', h: '~335px', el: S5 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#f7f4ea', color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '32px 40px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: '1px solid #e2dcc0', paddingBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: sub }}>
            Get Long · speed v9 · all sizes · v8 small + v6 large
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            XS+S taken from v8 · M+L+XL taken from v6
          </div>
        </div>
        <div style={{ fontSize: 12, color: sub, fontWeight: 500,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          5 sizes · refer by ID
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map(it => (
          <div key={it.id} style={{ maxWidth: 420 }}>
            <Label id={it.id} name={it.name} h={it.h}/>
            {it.el}
          </div>
        ))}
      </div>
    </div>
  );
}

window.GetLongSpeedSizesV9 = GetLongSpeedSizesV9;
