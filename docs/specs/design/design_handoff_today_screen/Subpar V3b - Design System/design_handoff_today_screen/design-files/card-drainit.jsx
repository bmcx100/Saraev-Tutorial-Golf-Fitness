// "Drain It" card — putting accuracy challenge, 5 height/density variations
// Make 10 putts in a row from 6 ft to complete a session · 12 sessions per challenge.
// Visual lineage from Get Long v5: forest card, citron accent, locked putting-green + flag
// decoration with full circle (no clipped edge).

function GetLongCardSizesV5() {
  const forest = '#1d4e34';
  const citron = '#cfde50';
  const cream = '#fbf6e6';
  const ink = '#10241a';
  const sub = '#6b756f';

  // Putting-green + flag decoration — ALWAYS the same size/position on every card.
  // The card's overflow:hidden does the cropping; smaller cards show less of the green/hole.
  // Pin is shifted down-and-left from Topo v3 so the flag still sits well in the visible band
  // even when the card is just a pill row.
  const PuttingGreen = () => (
    <svg style={{ position: 'absolute', top: -35, right: -30, opacity: 0.6, pointerEvents: 'none',
      overflow: 'visible' }}
         width={220} height={220} viewBox="0 0 100 100">
      {/* fairway green disc — same size as v4, but svg overflow:visible lets the
          left side of the circle render fully (no flat clipped edge) */}
      <ellipse cx="55" cy="58" rx="56" ry="50" fill="#bcdfc6"/>
      {/* fringe ring */}
      <ellipse cx="55" cy="58" rx="56" ry="50" fill="none" stroke="#92cba2" strokeWidth="1.2"/>
      {/* highlight on green */}
      <ellipse cx="40" cy="50" rx="26" ry="16" fill="#d4e8d9" opacity="0.6"/>
      {/* cup hole — same as v4 */}
      <ellipse cx="42" cy="86" rx="3.2" ry="1.6" fill={forest}/>
      {/* flag pole */}
      <line x1="42" y1="86" x2="42" y2="21" stroke={forest} strokeWidth="1.3" strokeLinecap="round"/>
      {/* flag */}
      <path d="M42 23 L64 28 L42 33 Z" fill={citron}/>
    </svg>
  );

  // Topo line backdrop scaled to a card's viewBox
  const TopoLines = ({ vb = '0 0 350 200' }) => (
    <svg style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
         width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke={citron} strokeWidth="0.8">
        <path d="M-20 40 C 80 20, 200 80, 380 30"/>
        <path d="M-20 80 C 80 60, 200 130, 380 70"/>
        <path d="M-20 130 C 80 110, 200 180, 380 120"/>
        <path d="M-20 180 C 80 160, 200 230, 380 170"/>
      </g>
    </svg>
  );

  const cardShell = {
    position: 'relative', borderRadius: 24, overflow: 'hidden',
    background: forest, color: cream,
    boxShadow: '0 14px 30px rgba(29,78,52,0.28)',
    fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
  };

  const Label = ({ id, name, h }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 8px 4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        background: ink, color: citron, padding: '3px 8px', borderRadius: 99,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{id}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: ink, letterSpacing: '-0.01em',
        fontFamily: '"Outfit", system-ui, sans-serif' }}>{name}</div>
      <div style={{ fontSize: 12, color: sub, fontWeight: 500,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{h}</div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S1 · XS — Pill / Status row
  // ───────────────────────────────────────────────────────────
  const S1 = (
    <div style={{ ...cardShell, padding: '12px 16px 12px 16px' }}>
      <TopoLines vb="0 0 350 60"/>
      <PuttingGreen/>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: citron, color: forest, padding: '3px 8px', borderRadius: 99,
          fontSize: 10.5, fontWeight: 700 }}>
          <I.flagFill width={10} height={10}/>
          ACTIVE
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Drain It
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          1/12 · 29d
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S2 · S — Compact, title + bar + stats
  // ───────────────────────────────────────────────────────────
  const S2 = (
    <div style={{ ...cardShell, padding: '14px 18px 14px' }}>
      <TopoLines vb="0 0 350 100"/>
      <PuttingGreen/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: citron, color: forest, padding: '3px 9px', borderRadius: 99,
          fontSize: 11, fontWeight: 700 }}>
          <I.flagFill width={11} height={11}/>
          ACTIVE
        </div>
        <div style={{ fontSize: 11.5, opacity: 0.85, fontWeight: 600 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 6, fontSize: 26, fontWeight: 800,
        letterSpacing: '-0.03em', lineHeight: 1 }}>
        Drain It.
      </div>
      <div style={{ position: 'relative', marginTop: 10, height: 6, background: 'rgba(255,255,255,0.18)',
        borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: '8%', height: '100%', background: citron, borderRadius: 99,
          boxShadow: `0 0 10px ${citron}` }}/>
      </div>
      <div style={{ position: 'relative', marginTop: 6, display: 'flex', justifyContent: 'space-between',
        fontSize: 11.5, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.7 }}>/12</span></span>
        <span style={{ opacity: 0.78 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S3 · M — Standard (Topo v3 default)
  // ───────────────────────────────────────────────────────────
  const S3 = (
    <div style={{ ...cardShell, padding: '18px 20px 18px', borderRadius: 26 }}>
      <TopoLines vb="0 0 350 220"/>
      <PuttingGreen/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
          fontSize: 11, fontWeight: 700 }}>
          <I.flagFill width={11} height={11}/>
          ACTIVE · HOLE 1
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, fontSize: 40, fontWeight: 800,
        letterSpacing: '-0.035em', lineHeight: 0.95 }}>
        Drain It.
      </div>
      <div style={{ position: 'relative', marginTop: 4, fontSize: 12.5, opacity: 0.78, fontWeight: 500 }}>
        10 in a row from 6 ft · 12 sessions
      </div>
      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 9, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.15)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 8, display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600 }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span><span style={{ opacity: 0.7 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.78 }}>29 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S4 · L — Detailed: + metric strip
  // ───────────────────────────────────────────────────────────
  const S4 = (
    <div style={{ ...cardShell, padding: '20px 22px 20px', borderRadius: 28 }}>
      <TopoLines vb="0 0 350 280"/>
      <PuttingGreen/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
          fontSize: 11, fontWeight: 700 }}>
          <I.flagFill width={11} height={11}/>
          ACTIVE · HOLE 1
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Day 1 / 30</div>
      </div>
      <div style={{ position: 'relative', marginTop: 12, fontSize: 44, fontWeight: 800,
        letterSpacing: '-0.035em', lineHeight: 0.95 }}>
        Drain It.
      </div>
      <div style={{ position: 'relative', marginTop: 4, fontSize: 13, opacity: 0.78, fontWeight: 500 }}>
        10 in a row from 6 ft · 12 sessions
      </div>

      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Best run</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: citron, marginTop: 2, lineHeight: 1 }}>8 in a row</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>Fri · session 2</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 3 }}>
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
  );

  // ───────────────────────────────────────────────────────────
  // S5 · XL — Full / Expanded: + CTA + extra context
  // ───────────────────────────────────────────────────────────
  const S5 = (
    <div style={{ ...cardShell, padding: '22px 22px 22px', borderRadius: 30 }}>
      <TopoLines vb="0 0 350 400"/>
      <PuttingGreen/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
          fontSize: 11, fontWeight: 700 }}>
          <I.flagFill width={11} height={11}/>
          ACTIVE · HOLE 1
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>Day 1 / 30 · 4-week plan</div>
      </div>

      <div style={{ position: 'relative', marginTop: 12, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92 }}>
            Drain It.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.78, fontWeight: 500 }}>
            10 in a row from 6 ft · 12 sessions
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Streak
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: citron, lineHeight: 1, marginTop: 2 }}>
            12<span style={{ fontSize: 14, marginLeft: 2 }}>d</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 16, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 14 }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Best run</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: citron, marginTop: 2, lineHeight: 1 }}>8 in a row</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 14 }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Next</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>Fri · session 2</div>
        </div>
        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 14 }}>
          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>73%</div>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 16, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 4,
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

      <div style={{ position: 'relative', marginTop: 18, display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none',
          background: citron, color: forest, fontWeight: 800, fontSize: 14, cursor: 'pointer',
          letterSpacing: '-0.01em' }}>
          Start session 2 →
        </button>
        <button style={{ padding: '14px 18px', borderRadius: 16,
          background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.22)',
          color: cream, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Plan
        </button>
      </div>
    </div>
  );

  const items = [
    { id: 'DI-XS', name: 'Cropped — pill row',     h: '~64px',  el: S1 },
    { id: 'DI-S',  name: 'Compact — minimal info', h: '~140px', el: S2 },
    { id: 'DI-M',  name: 'Standard',                h: '~210px', el: S3 },
    { id: 'DI-L',  name: 'Detailed — + metrics',   h: '~290px', el: S4 },
    { id: 'DI-XL', name: 'Full — expanded + CTA',  h: '~440px', el: S5 },
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
            Drain It card · size variations
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            Make 10 in a row from 6 ft
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

window.GetLongCardSizesV5 = GetLongCardSizesV5;
