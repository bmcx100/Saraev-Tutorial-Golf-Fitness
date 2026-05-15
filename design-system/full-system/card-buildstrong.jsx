// Build Strong · v6 — photo background, all sizes
// Same as BuildStrongPhotoSizes (gym-floor barbell photo · forest tint · Y5
// button on XL) — only the Cropped (XS) card swaps its background settings to
// match Try 3 from the cropped tries:
//   size: 80% · position: right 50%
// XS → Try 3 settings. S/M/L/XL are unchanged (cover · center 50%).

function BuildStrongV6() {
  const greenDeep = '#11371f';   // G2
  const green = '#1d4e34';       // G3
  const citron = '#cfde50';      // Y5
  const cream = '#fbf6e6';
  const ink = '#10241a';
  const sub = '#6b756f';

  const PHOTO = 'assets/buildstrong-barbell.png';

  // PhotoBg accepts size + position; default = cover · center 50%.
  // The XS card overrides with Try 3 settings.
  const PhotoBg = ({ size = 'cover', position = 'center 40%' }) => (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${PHOTO})`,
        backgroundSize: size,
        backgroundPosition: position,
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

  const cardShell = {
    position: 'relative', borderRadius: 24, overflow: 'hidden',
    background: greenDeep, color: cream,
    boxShadow: `0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
    fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
  };

  const ActivePill = ({ children, size = 11 }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      background: citron, color: greenDeep,
      padding: size > 11 ? '4px 10px' : '3px 9px',
      borderRadius: 99, fontSize: size, fontWeight: 800 }}>
      <I.dumbbell width={size} height={size}/>
      {children}
    </div>
  );

  const StreakReadout = ({ size = 'md' }) => {
    const sz = size === 'sm' ? { num: 22, lbl: 10, gap: 2, sub: 13 }
             : size === 'md' ? { num: 32, lbl: 11, gap: 3, sub: 18 }
             : { num: 44, lbl: 13, gap: 4, sub: 24 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', lineHeight: 1 }}>
        <div style={{ fontSize: sz.num, fontWeight: 800, color: citron,
          letterSpacing: '-0.035em', fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 18px ${citron}66` }}>
          5<span style={{ fontSize: sz.sub, marginLeft: 1 }}>d</span>
        </div>
        <div style={{ marginTop: sz.gap, fontSize: sz.lbl, fontWeight: 700,
          letterSpacing: '0.16em', color: 'rgba(251,246,230,0.65)',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          STREAK
        </div>
      </div>
    );
  };

  const Label = ({ id, name, h }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10,
      margin: '0 0 8px 4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        background: ink, color: citron, padding: '3px 8px', borderRadius: 99,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{id}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: ink,
        letterSpacing: '-0.01em' }}>{name}</div>
      <div style={{ fontSize: 12, color: sub, fontWeight: 500,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{h}</div>
    </div>
  );

  // Glassy panel for stat tiles + secondary button (legibility over photo)
  const glass = {
    background: 'rgba(10,24,18,0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.10)',
  };

  // ───────────────────────────────────────────────────────────
  // XS · Cropped — uses Try 3 settings: size 80%, position right 50%
  // ───────────────────────────────────────────────────────────
  const S1 = (
    <div style={{ ...cardShell, padding: '12px 16px' }}>
      <PhotoBg size="80%" position="right 50%"/>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex',
        alignItems: 'center', gap: 12 }}>
        <ActivePill size={10.5}>DAY 5</ActivePill>
        <div style={{ flex: 1, fontSize: 17, fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1,
          textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
          Build Strong
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: citron,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 10px ${citron}55` }}>
          5d<span style={{ fontSize: 9.5, color: 'rgba(251,246,230,0.65)',
            marginLeft: 4, fontWeight: 700, letterSpacing: '0.12em',
            fontFamily: '"JetBrains Mono", monospace' }}>STREAK</span>
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // S · Compact — baseline (cover · center 40%)
  // ───────────────────────────────────────────────────────────
  const S2 = (
    <div style={{ ...cardShell, padding: '14px 18px' }}>
      <PhotoBg/>
      <div style={{ position: 'relative', zIndex: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ActivePill>DAY 5</ActivePill>
        <div style={{ fontSize: 11.5, color: 'rgba(251,246,230,0.7)', fontWeight: 600,
          textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Session 1 / 12</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 6,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', gap: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em',
          lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}>
          Build Strong.
        </div>
        <StreakReadout size="sm"/>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10, height: 6,
        background: 'rgba(0,0,0,0.35)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: '8%', height: '100%', background: citron,
          borderRadius: 99, boxShadow: `0 0 10px ${citron}` }}/>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 6,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11.5, fontWeight: 600,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span>
          <span style={{ opacity: 0.7 }}>/12</span></span>
        <span style={{ opacity: 0.7 }}>25 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ +15 lb</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // M · Standard — baseline
  // ───────────────────────────────────────────────────────────
  const S3 = (
    <div style={{ ...cardShell, padding: '18px 20px', borderRadius: 26 }}>
      <PhotoBg/>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>DAY 5 · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(251,246,230,0.78)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Day 5 / 30</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 12,
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 0.95,
            textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>
            Build Strong.
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 500,
            color: 'rgba(251,246,230,0.78)',
            textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
            Resistance + injury prevention · 12 sessions
          </div>
        </div>
        <StreakReadout size="md"/>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 14,
        display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 9, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.18)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 8,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span>
          <span style={{ opacity: 0.7 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.75 }}>25 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ +15 lb</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // L · Detailed — baseline
  // ───────────────────────────────────────────────────────────
  const S4 = (
    <div style={{ ...cardShell, padding: '20px 22px', borderRadius: 28 }}>
      <PhotoBg/>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>DAY 5 · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(251,246,230,0.78)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Day 5 / 30</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 12,
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 0.95,
            textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>
            Build Strong.
          </div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500,
            color: 'rgba(251,246,230,0.78)',
            textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
            Resistance + injury prevention · 12 sessions
          </div>
        </div>
        <StreakReadout size="md"/>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 14,
        display: 'flex', gap: 10 }}>
        <div style={{ ...glass, flex: 1, padding: '8px 12px', borderRadius: 12 }}>
          <div style={{ fontSize: 10, color: 'rgba(251,246,230,0.7)', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase' }}>Top lift</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: citron,
            marginTop: 2, lineHeight: 1 }}>185 lb</div>
        </div>
        <div style={{ ...glass, flex: 1, padding: '8px 12px', borderRadius: 12 }}>
          <div style={{ fontSize: 10, color: 'rgba(251,246,230,0.7)', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase' }}>Volume / wk</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3,
            lineHeight: 1, color: cream }}>4.2k lb</div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 14,
        display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 10, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.18)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span>
          <span style={{ opacity: 0.7 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.75 }}>25 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────
  // XL · Full / Expanded — Y5 solid-glow CTA
  // ───────────────────────────────────────────────────────────
  const S5 = (
    <div style={{ ...cardShell, padding: '22px 22px', borderRadius: 30 }}>
      <PhotoBg/>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <ActivePill>DAY 5 · SESSION 1</ActivePill>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(251,246,230,0.78)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
          Day 5 / 30 · 4-week plan
        </div>
      </div>

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
        <StreakReadout size="lg"/>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 16,
        display: 'flex', gap: 10 }}>
        {[
          { label: 'Top lift',    val: '185 lb',  big: true },
          { label: 'Volume / wk', val: '4.2k lb' },
          { label: 'Δ Week',      val: '+15 lb',  accent: true },
        ].map((m, i) => (
          <div key={i} style={{ ...glass, flex: 1, padding: '10px 12px',
            borderRadius: 14 }}>
            <div style={{ fontSize: 10, color: 'rgba(251,246,230,0.7)', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontSize: m.big ? 18 : 14,
              fontWeight: m.big ? 800 : 700, marginTop: m.big ? 2 : 3,
              lineHeight: 1, color: (m.big || m.accent) ? citron : cream }}>
              {m.val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 16,
        display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 12, borderRadius: 4,
            background: i < 1 ? citron : 'rgba(255,255,255,0.18)',
            boxShadow: i < 1 ? `0 0 10px ${citron}` : 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: 10,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontWeight: 600,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        <span><span style={{ color: citron, fontWeight: 800 }}>1</span>
          <span style={{ opacity: 0.7 }}>/12 sessions</span></span>
        <span style={{ opacity: 0.75 }}>25 days left</span>
        <span style={{ color: citron, fontWeight: 700 }}>↑ On track</span>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 18,
        display: 'flex', gap: 8 }}>
        {/* Standard yellow CTA — same treatment as "Pick your heavy thing" */}
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

  const items = [
    { id: 'BS6-XS', name: 'Cropped — Try 3 settings (80% · right 50%)', h: '~64px',  el: S1 },
    { id: 'BS6-S',  name: 'Compact',                                    h: '~140px', el: S2 },
    { id: 'BS6-M',  name: 'Standard',                                   h: '~210px', el: S3 },
    { id: 'BS6-L',  name: 'Detailed',                                   h: '~290px', el: S4 },
    { id: 'BS6-XL', name: 'Full — expanded + Y5 CTA',                   h: '~440px', el: S5 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#f7f4ea', color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '32px 40px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2dcc0', paddingBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: sub }}>
            Build Strong · v6 · cropped Try 3 + photo sizes
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em',
            marginTop: 4 }}>
            XS = Try 3 (80% · right) · S/M/L/XL baseline photo
          </div>
        </div>
        <div style={{ fontSize: 12, color: sub, fontWeight: 500,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          5 sizes · refer by ID
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map(it => (
          <div key={it.id} style={{ maxWidth: 460 }}>
            <Label id={it.id} name={it.name} h={it.h}/>
            {it.el}
          </div>
        ))}
      </div>
    </div>
  );
}

window.BuildStrongV6 = BuildStrongV6;
