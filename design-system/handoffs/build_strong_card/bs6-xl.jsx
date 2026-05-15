// Build Strong · BS6-XL — standalone reference component
// Extracted from card-buildstrong.jsx (BuildStrongV6 → S5 variant).
// Photo background with forest tint stack, glassy stat tiles, citron Y5 CTA.
//
// Renders at the card's native phone-width footprint (~354px wide,
// ~440px tall). Wrap in a phone frame to see in context.

function BS6XL() {
  const greenDeep = '#11371f';   // G2
  const green     = '#1d4e34';   // G3
  const citron    = '#cfde50';   // Y5 (THE accent)
  const cream     = '#fbf6e6';
  const ink       = '#10241a';

  // Photo asset — resolve relative to wherever this file is imported.
  const PHOTO = 'assets/buildstrong-barbell.png';

  // ── Background stack: photo + dual gradient + multiply tint ──
  const PhotoBg = () => (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${PHOTO})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        filter: 'saturate(0.85) contrast(1.05)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        background: `linear-gradient(180deg,
          rgba(10,24,18,0.78) 0%,
          rgba(17,55,31,0.62) 40%,
          rgba(17,55,31,0.48) 70%,
          rgba(17,55,31,0.72) 100%)`,
      }}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        background: `linear-gradient(135deg, ${green}33 0%, ${greenDeep}55 100%)`,
        mixBlendMode: 'multiply',
      }}/>
    </>
  );

  // ── Active "DAY 5 · SESSION 1" pill ──
  const ActivePill = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      background: citron, color: greenDeep,
      padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 800,
      fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <I.dumbbell width={11} height={11}/>
      DAY 5 · SESSION 1
    </div>
  );

  // ── Big citron streak readout ──
  const StreakReadout = () => (
    <div style={{ display: 'flex', flexDirection: 'column',
      alignItems: 'flex-end', lineHeight: 1 }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: citron,
        letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 18px ${citron}66` }}>
        5<span style={{ fontSize: 24, marginLeft: 1 }}>d</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700,
        letterSpacing: '0.16em', color: 'rgba(251,246,230,0.65)',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
        STREAK
      </div>
    </div>
  );

  // ── Glassy panel style for stat tiles + secondary button ──
  const glass = {
    background: 'rgba(10,24,18,0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.10)',
  };

  // ── Card shell ──
  const cardShell = {
    position: 'relative', borderRadius: 30, overflow: 'hidden',
    background: greenDeep, color: cream,
    boxShadow: `0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
    fontFamily: '"Outfit", system-ui, sans-serif',
    padding: '22px 22px',
  };

  const tiles = [
    { label: 'Top lift',    val: '185 lb',  big: true },
    { label: 'Volume / wk', val: '4.2k lb' },
    { label: 'Δ Week',      val: '+15 lb',  accent: true },
  ];

  return (
    <div style={cardShell}>
      <PhotoBg/>

      {/* Top row: status pill + plan caption */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill/>
        <div style={{ fontSize: 12, fontWeight: 600,
          color: 'rgba(251,246,230,0.78)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
          Day 5 / 30 · 4-week plan
        </div>
      </div>

      {/* Title row */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 12,
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 52, fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.92,
            textShadow: '0 2px 14px rgba(0,0,0,0.45)' }}>
            Build Strong.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500,
            color: 'rgba(251,246,230,0.78)',
            textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
            Resistance + injury prevention · 12 sessions
          </div>
        </div>
        <StreakReadout/>
      </div>

      {/* Stat tiles */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 16,
        display: 'flex', gap: 10 }}>
        {tiles.map((m, i) => (
          <div key={i} style={{ ...glass, flex: 1, padding: '10px 12px',
            borderRadius: 14 }}>
            <div style={{ fontSize: 10,
              color: 'rgba(251,246,230,0.7)', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {m.label}
            </div>
            <div style={{ fontSize: m.big ? 18 : 14,
              fontWeight: m.big ? 800 : 700, marginTop: m.big ? 2 : 3,
              lineHeight: 1, color: (m.big || m.accent) ? citron : cream }}>
              {m.val}
            </div>
          </div>
        ))}
      </div>

      {/* Session progress bar (12 segments) */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 16,
        display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.18)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>

      {/* Progress meta row */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span>
          <span style={{ opacity: 0.7 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.75 }}>25 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>

      {/* CTAs */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 18,
        display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none',
          background: citron, color: greenDeep, fontWeight: 800, fontSize: 14,
          cursor: 'pointer', letterSpacing: '-0.01em',
          fontFamily: '"Outfit", system-ui, sans-serif',
          boxShadow: `0 8px 18px ${citron}55, 0 0 0 4px ${citron}1f` }}>
          Start session 2 →
        </button>
        <button style={{ ...glass, padding: '14px 18px', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.22)',
          color: cream, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Plan
        </button>
      </div>
    </div>
  );
}

window.BS6XL = BS6XL;
