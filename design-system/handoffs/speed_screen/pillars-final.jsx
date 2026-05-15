// Subpar · Pillars · P3 stick form — two final refinements
// V1 · uniform · dots at the bottom of each card (half on / half off)
//   · inactive cards muted (lower opacity, thinner border, paper cap-glow)
// V2 · variable widths · ACTIVE = Red (wider), Green + Blue narrower,
//   · inactive treatment kept rich (same as the original P3 inactive)

(function () {
  const { SPColors, ForestHero, Keypad, CTABar, StickRing } = window;
  const { ink, sub, forest, greenDeep, citron, cream, paper, rule,
          stickGreen, stickBlue, stickRed } = SPColors;
  const stickColors = { green: stickGreen, blue: stickBlue, red: stickRed };

  // ─── Compact section heading ─────────────────────────────────────
  const SectionHeading = ({ progress = '1 / 6' }) => (
    <div style={{ padding: '14px 18px 4px',
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', gap: 14 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, fontWeight: 700, color: sub,
          letterSpacing: '0.24em' }}>DRILL · 1 OF 3</div>
        <div style={{ marginTop: 3, fontSize: 22, fontWeight: 800,
          letterSpacing: '-0.03em', color: ink, lineHeight: 1 }}>
          Normal Stance.
        </div>
        <div style={{ marginTop: 3, fontSize: 12, fontWeight: 500,
          color: sub, lineHeight: 1.35 }}>
          3 sticks · swing 3× · best wins
        </div>
      </div>
      <div style={{ textAlign: 'right', flex: '0 0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 20, fontWeight: 700, color: greenDeep,
          letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
          {progress}
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, fontWeight: 700, color: sub,
          letterSpacing: '0.22em' }}>SWINGS</span>
      </div>
    </div>
  );

  // ─── Bottom dots (half on, half off the card edge) ───────────────
  const BottomDots = ({ done = 0, total = 3, color = forest, bg = paper }) => (
    <div style={{ position: 'absolute',
      bottom: 0, left: '50%',
      transform: 'translate(-50%, 50%)',
      background: bg, padding: '4px 8px', borderRadius: 99,
      display: 'flex', gap: 5, alignItems: 'center',
      border: `1px solid ${rule}` }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: 99,
          background: i < done ? color : 'rgba(14,33,24,0.18)',
          boxShadow: i === done - 1 ? `0 0 4px ${color}` : 'none',
        }}/>
      ))}
    </div>
  );

  // ─── Active-style stick pillar (rich treatment) ──────────────────
  // Used both as the "active" pillar and (in v2) as the "rich inactive"
  // treatment when we want the inactive sticks to keep their character.
  function StickPillar({ stick, name, dom, non, active, focus, swings = 0,
    flex = 1, muted = false }) {
    const sc = stickColors[stick];
    const opacity = muted ? 0.68 : 1;
    const Cell = ({ label, value, isFocus }) => {
      const filled = value != null;
      return (
        <div style={{
          background: isFocus ? sc + '15' : 'transparent',
          border: isFocus ? `2px solid ${forest}` : `1px dashed ${sc}66`,
          borderRadius: 10, padding: '7px 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          position: 'relative' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8, fontWeight: 700, color: sub,
            letterSpacing: '0.22em' }}>{label}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 19, fontWeight: 700,
            color: filled || isFocus ? greenDeep : 'rgba(14,33,24,0.22)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1 }}>
            {filled ? value : '——'}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8, fontWeight: 600, color: sub,
            letterSpacing: '0.08em' }}>mph</span>
        </div>
      );
    };
    return (
      <div style={{ flex, position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        opacity }}>
        {/* tee head */}
        <div style={{ alignSelf: 'center',
          width: 20, height: 20, borderRadius: '50%',
          background: sc,
          border: active ? `2px solid ${citron}` : 'none',
          boxShadow: active
            ? `0 0 0 3px rgba(207,222,80,0.5), 0 4px 8px ${sc}55`
            : `0 2px 4px ${sc}55`,
          marginBottom: -2, zIndex: 2, position: 'relative' }}>
          {active && (
            <span style={{ position: 'absolute',
              top: -20, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `7px solid ${greenDeep}` }}/>
          )}
        </div>
        {/* grip band */}
        <div style={{ position: 'relative', background: sc,
          borderTopLeftRadius: 14, borderTopRightRadius: 14,
          padding: '6px 6px 5px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          boxShadow: `inset 0 -2px 0 ${sc}99` }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.005em',
            textShadow: '0 1px 0 rgba(0,0,0,0.15)' }}>{name}</span>
        </div>
        {/* shaft */}
        <div style={{ flex: 1, position: 'relative',
          background: active ? '#fff' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${active ? sc : rule}`,
          borderTop: 'none',
          borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
          padding: '10px 6px 14px',
          display: 'flex', flexDirection: 'column', gap: 6,
          boxShadow: active
            ? `0 12px 22px rgba(17,55,31,0.14), 0 0 0 2px ${sc}33`
            : 'none' }}>
          <div style={{ position: 'absolute', top: 4, bottom: 18,
            left: '50%', width: 1, background: `${sc}22`,
            transform: 'translateX(-0.5px)' }}/>
          <Cell label="DOM"     value={dom} isFocus={focus === 'dom'}/>
          <Cell label="NON-DOM" value={non} isFocus={focus === 'non'}/>
          <BottomDots done={swings} color={sc} bg={paper}/>
        </div>
      </div>
    );
  }

  // ─── Muted stick pillar (V1 inactive treatment) ──────────────────
  // No cap, no grip color, paper shaft, just stick-color ring + name.
  function MutedStickPillar({ stick, name, dom, non, swings = 0, flex = 1 }) {
    const sc = stickColors[stick];
    const Cell = ({ label, value }) => {
      const filled = value != null;
      return (
        <div style={{
          border: `1px dashed ${rule}`,
          borderRadius: 10, padding: '7px 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          background: 'transparent' }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8, fontWeight: 700, color: sub,
            letterSpacing: '0.22em' }}>{label}</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 19, fontWeight: 700,
            color: filled ? ink : 'rgba(14,33,24,0.18)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {filled ? value : '——'}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 8, fontWeight: 600, color: 'rgba(107,117,111,0.7)',
            letterSpacing: '0.08em' }}>mph</span>
        </div>
      );
    };
    return (
      <div style={{ flex, position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* small ring instead of full cap */}
        <div style={{ alignSelf: 'center',
          width: 14, height: 14, marginBottom: 4 }}>
          <StickRing color={sc} size={14}/>
        </div>
        {/* header band — paper-toned */}
        <div style={{ background: 'rgba(255,255,255,0.5)',
          border: `1px solid ${rule}`,
          borderTopLeftRadius: 14, borderTopRightRadius: 14,
          padding: '5px 6px',
          display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: sub,
            letterSpacing: '-0.005em' }}>{name}</span>
        </div>
        {/* shaft */}
        <div style={{ flex: 1, position: 'relative',
          background: 'rgba(255,255,255,0.4)',
          border: `1px solid ${rule}`, borderTop: 'none',
          borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
          padding: '10px 6px 14px',
          display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Cell label="DOM"     value={dom}/>
          <Cell label="NON-DOM" value={non}/>
          <BottomDots done={swings} color={'rgba(14,33,24,0.4)'} bg={paper}/>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // V1 · UNIFORM · dots at bottom · inactive muted
  // ═══════════════════════════════════════════════════════════════════
  function PillarsP3Refined() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column' }}>
        <ForestHero pr="118"/>
        <SectionHeading progress="1 / 6"/>
        <div style={{ padding: '8px 14px 18px', flex: 1,
          display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <StickPillar stick="green" name="Green" dom={117} non={null}
            active focus="dom" swings={2}/>
          <MutedStickPillar stick="blue"  name="Blue"  dom={null} non={null} swings={0}/>
          <MutedStickPillar stick="red"   name="Red"   dom={null} non={null} swings={0}/>
        </div>
        <Keypad/>
        <CTABar label="Log 117 mph" glyph="→"/>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // V2 · VARIABLE WIDTHS · ACTIVE = RED (wider) · inactive kept rich
  // ═══════════════════════════════════════════════════════════════════
  // Green + Blue keep the full stick treatment (cap, grip color, etc.)
  // but render narrower. Red expands and takes ~1.6× width.
  function PillarsP3RedActive() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column' }}>
        <ForestHero pr="118"/>
        <SectionHeading progress="1 / 6"/>
        <div style={{ padding: '8px 14px 18px', flex: 1,
          display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <StickPillar stick="green" name="Green" dom={118} non={112}
            flex={1} swings={3}/>
          <StickPillar stick="blue"  name="Blue"  dom={114} non={108}
            flex={1} swings={3}/>
          <StickPillar stick="red"   name="Red"   dom={121} non={null}
            active focus="non" flex={1.6} swings={2}/>
        </div>
        <Keypad/>
        <CTABar label="Log 113 mph" glyph="→"/>
      </div>
    );
  }

  Object.assign(window, { PillarsP3Refined, PillarsP3RedActive });
})();
