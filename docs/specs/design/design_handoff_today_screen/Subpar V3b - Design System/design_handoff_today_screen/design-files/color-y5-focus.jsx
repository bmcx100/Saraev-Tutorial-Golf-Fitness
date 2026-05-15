// "Y5 · Citron" focus artboard — the single accent yellow used on Topo v4's nav bar
// selected pill, the "Get Long" active pill, and the progress glow. Big swatch +
// button variations using only this yellow.

function YellowFocusY5() {
  const citron = '#cfde50';   // Y5 — the one
  const forest = '#1d4e34';
  const forestDeep = '#10301f';
  const inkOnYellow = '#10241a';
  const cream = '#fbf6e6';
  const bgPanel = '#f7f4ea';
  const sub = '#6b756f';
  const sage = '#bcdfc6';

  // ── Button family — all use Y5 as the accent
  const Btn = ({ kind, children, icon, full }) => {
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '12px 18px', borderRadius: 14, border: 'none', cursor: 'pointer',
      fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em',
      fontFamily: '"Outfit", system-ui, sans-serif',
      width: full ? '100%' : 'auto',
    };
    switch (kind) {
      case 'solid':
        return <button style={{ ...base, background: citron, color: inkOnYellow,
          boxShadow: `0 6px 14px rgba(207,222,80,0.28)` }}>{icon}{children}</button>;
      case 'solid-glow':
        return <button style={{ ...base, background: citron, color: forestDeep,
          boxShadow: `0 0 0 4px rgba(207,222,80,0.22), 0 10px 20px rgba(207,222,80,0.35)` }}>
          {icon}{children}</button>;
      case 'pill':
        return <button style={{ ...base, background: citron, color: forestDeep,
          padding: '10px 16px', borderRadius: 99, fontSize: 13 }}>{icon}{children}</button>;
      case 'outline':
        return <button style={{ ...base, background: 'transparent', color: citron,
          border: `1.5px solid ${citron}` }}>{icon}{children}</button>;
      case 'outline-onlight':
        return <button style={{ ...base, background: 'transparent', color: forestDeep,
          border: `1.5px solid ${citron}` }}>{icon}{children}</button>;
      case 'ghost':
        return <button style={{ ...base, background: 'rgba(207,222,80,0.15)', color: forest,
          padding: '10px 14px', fontSize: 13 }}>{icon}{children}</button>;
      case 'underline':
        return <button style={{ ...base, background: 'transparent', color: citron,
          padding: '4px 0', borderRadius: 0,
          borderBottom: `2px solid ${citron}` }}>{icon}{children}</button>;
      case 'icon':
        return <button style={{ ...base, background: citron, color: forestDeep,
          padding: '12px', borderRadius: 99, width: 44, height: 44,
          boxShadow: `0 6px 14px rgba(207,222,80,0.28)` }}>{icon}</button>;
      case 'icon-outline':
        return <button style={{ ...base, background: 'transparent', color: citron,
          padding: '12px', borderRadius: 99, width: 44, height: 44,
          border: `1.5px solid ${citron}` }}>{icon}</button>;
      case 'segmented':
        return <div style={{ display: 'inline-flex', padding: 4, borderRadius: 99,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(207,222,80,0.18)',
          fontFamily: '"Outfit", sans-serif' }}>
          <div style={{ padding: '8px 14px', borderRadius: 99,
            background: citron, color: forestDeep, fontWeight: 800, fontSize: 12.5 }}>Today</div>
          <div style={{ padding: '8px 14px', borderRadius: 99,
            color: 'rgba(251,246,230,0.6)', fontWeight: 600, fontSize: 12.5 }}>Week</div>
          <div style={{ padding: '8px 14px', borderRadius: 99,
            color: 'rgba(251,246,230,0.6)', fontWeight: 600, fontSize: 12.5 }}>All</div>
        </div>;
      case 'fab':
        return <button style={{ ...base, background: citron, color: forestDeep,
          padding: '16px', borderRadius: 999, width: 56, height: 56,
          boxShadow: `0 14px 28px rgba(207,222,80,0.45), 0 0 0 6px rgba(207,222,80,0.18)`,
          fontSize: 22 }}>{icon}</button>;
      default: return null;
    }
  };

  const Label = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: sub, marginBottom: 8 }}>{children}</div>
  );

  const Card = ({ bg, children, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Label>{label}</Label>
      <div style={{ background: bg, borderRadius: 18, padding: '20px 22px',
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        border: bg === bgPanel ? '1px solid #e6e0c4' : 'none' }}>
        {children}
      </div>
    </div>
  );

  const PlayIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );
  const Arrow = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: bgPanel, color: inkOnYellow,
      fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
      padding: '32px 36px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        borderBottom: '1px solid #e2dcc0', paddingBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: sub }}>
            Colors · accent focus
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            Y5 — Citron <span style={{ color: sub, fontWeight: 500 }}>· the only yellow</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: citron,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}/>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
            #CFDE50
          </div>
        </div>
      </div>

      {/* Hero swatch row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Big swatch */}
        <div style={{ borderRadius: 22, background: citron, padding: '28px 28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 14px 30px rgba(207,222,80,0.30)' }}>
          {/* faint topo lines on the swatch, like the Topo card */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
               width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke={forestDeep} strokeWidth="0.7">
              <path d="M-20 40 C 80 20, 200 80, 380 30"/>
              <path d="M-20 80 C 80 60, 200 130, 380 70"/>
              <path d="M-20 130 C 80 110, 200 180, 380 120"/>
            </g>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: forestDeep, opacity: 0.7 }}>
              The accent
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.035em',
              color: forestDeep, lineHeight: 0.95, marginTop: 6 }}>
              Y5 · Citron
            </div>
            <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: forestDeep, opacity: 0.78 }}>
              Used on: nav active pill (Topo v4) · "Active" challenge pill · progress glow
            </div>
            <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 14,
              background: forestDeep, color: citron, padding: '8px 14px', borderRadius: 99,
              fontSize: 12.5, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
              <span>HEX #CFDE50</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>RGB 207 · 222 · 80</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>OKLCH 88% 0.16 116</span>
            </div>
          </div>
        </div>

        {/* On-context preview */}
        <div style={{ borderRadius: 22, background: forest, padding: '20px 22px',
          color: cream, position: 'relative', overflow: 'hidden',
          boxShadow: '0 14px 30px rgba(29,78,52,0.25)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(251,246,230,0.55)' }}>
            On forest · the canonical pairing
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* nav-bar pill */}
            <div style={{ background: forestDeep, borderRadius: 22, padding: 4, display: 'flex' }}>
              <div style={{ flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '8px 10px', borderRadius: 18, background: citron,
                color: forestDeep, fontWeight: 800, fontSize: 12 }}>
                ★ Today
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 10px', color: 'rgba(251,246,230,0.55)', fontWeight: 600, fontSize: 11.5 }}>
                Challenges
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 10px', color: 'rgba(251,246,230,0.55)', fontWeight: 600, fontSize: 11.5 }}>
                Stats
              </div>
            </div>
            {/* active pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                background: citron, color: forestDeep, padding: '4px 10px', borderRadius: 99,
                fontSize: 11, fontWeight: 800 }}>● ACTIVE · HOLE 1</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, opacity: 0.7 }}>Day 1 / 30</div>
            </div>
            {/* progress glow */}
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 3,
                  background: i < 1 ? citron : 'rgba(255,255,255,0.15)',
                  boxShadow: i < 1 ? `0 0 8px ${citron}` : 'none' }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons on light */}
      <Card bg={bgPanel} label="Buttons · on cream">
        <Btn kind="solid" icon={PlayIcon}>Start session</Btn>
        <Btn kind="solid-glow" icon={Arrow}>Continue</Btn>
        <Btn kind="pill">Today</Btn>
        <Btn kind="outline-onlight">View plan</Btn>
        <Btn kind="ghost">Skip</Btn>
        <Btn kind="icon" icon={PlayIcon}/>
        <Btn kind="icon-outline" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={citron}
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        }/>
      </Card>

      {/* Buttons on sage */}
      <Card bg={sage} label="Buttons · on sage (light green)">
        <Btn kind="solid" icon={PlayIcon}>Start session</Btn>
        <Btn kind="solid-glow" icon={Arrow}>Continue</Btn>
        <Btn kind="pill">Today</Btn>
        <Btn kind="outline-onlight">View plan</Btn>
      </Card>

      {/* Buttons on forest */}
      <Card bg={forest} label="Buttons · on forest (dark green)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Btn kind="solid" icon={PlayIcon}>Start session</Btn>
          <Btn kind="solid-glow" icon={Arrow}>Continue</Btn>
          <Btn kind="pill">Today</Btn>
          <Btn kind="outline">View plan</Btn>
          <Btn kind="underline">See all</Btn>
        </div>
      </Card>

      {/* Segmented + FAB row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card bg={forest} label="Segmented control · on forest">
          <Btn kind="segmented"/>
        </Card>
        <Card bg={bgPanel} label="Floating action button">
          <Btn kind="fab" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill={forestDeep}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          }/>
          <Btn kind="icon" icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={forestDeep}
                 strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          }/>
        </Card>
      </div>

      {/* Full-width primary CTA */}
      <Card bg={forest} label="Primary CTA · full-width on forest">
        <button style={{ width: '100%', padding: '16px 20px', borderRadius: 18, border: 'none',
          background: citron, color: forestDeep, fontWeight: 800, fontSize: 16,
          letterSpacing: '-0.01em', cursor: 'pointer',
          boxShadow: `0 12px 24px rgba(207,222,80,0.35), 0 0 0 4px rgba(207,222,80,0.18)`,
          fontFamily: '"Outfit", system-ui, sans-serif',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {PlayIcon} Start today's session →
        </button>
      </Card>

    </div>
  );
}

window.YellowFocusY5 = YellowFocusY5;
