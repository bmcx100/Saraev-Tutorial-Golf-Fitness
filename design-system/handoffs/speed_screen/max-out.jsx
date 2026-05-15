// Subpar · Speed Training · Max Out screen
// Built on the V1 P3 stick-form direction.
// 2 pillars: Green (speed stick) + Driver (club). Single SPEED cell each.

(function () {
  const { SPColors, ForestHero: ForestHeroBase, Keypad, CTABar, StickRing } = window;
  const { ink, sub, forest, greenDeep, citron, cream, paper, rule,
          stickGreen } = SPColors;

  // ─── Forest hero · Max Out tab active ────────────────────────────
  // (We re-implement just to flip the active tab + change the eyebrow.)
  const BackIcon = ({ s = 18, color = ink }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  const TabSegDark = ({ active = 2 }) => {
    const tabs = ['Normal', 'Step Drill', 'Max Out'];
    return (
      <div style={{ display: 'flex', gap: 6, padding: 4,
        background: 'rgba(251,246,230,0.10)',
        border: '1px solid rgba(251,246,230,0.16)',
        borderRadius: 14 }}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <div key={t} style={{ flex: 1,
              background: on ? citron : 'transparent', borderRadius: 10,
              padding: '8px 6px', textAlign: 'center',
              fontFamily: '"Outfit", system-ui, sans-serif',
              fontSize: 11.5, fontWeight: 800, letterSpacing: '0.04em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              color: on ? greenDeep : 'rgba(251,246,230,0.7)',
              boxShadow: on ? '0 6px 12px rgba(207,222,80,0.25), inset 0 1px 0 rgba(255,255,255,0.35)' : 'none' }}>
              {t}
            </div>
          );
        })}
      </div>
    );
  };

  const ForestHeroMaxOut = () => (
    <div style={{ position: 'relative',
      background: `linear-gradient(160deg, ${forest} 0%, ${greenDeep} 100%)`,
      color: cream, padding: '54px 18px 16px',
      borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 390 200"
           preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#6db483" strokeWidth="0.9">
          <path d="M-50 40 C 80 10, 220 110, 460 30"/>
          <path d="M-50 90 C 80 60, 220 160, 460 80"/>
          <path d="M-50 140 C 100 110, 240 200, 460 140"/>
          <path d="M-50 190 C 120 160, 260 250, 460 200"/>
        </g>
      </svg>

      <div style={{ position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, flex: '0 0 36px',
          display: 'grid', placeItems: 'center',
          background: 'rgba(251,246,230,0.10)', color: cream,
          border: '1px solid rgba(251,246,230,0.20)' }}>
          <BackIcon color={cream}/>
        </div>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.24em',
          color: 'rgba(251,246,230,0.6)', whiteSpace: 'nowrap' }}>
          DAY 1 · SESSION 3 · DRILL 3 / 3
        </span>
      </div>

      <div style={{ position: 'relative', marginTop: 14,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: citron,
            fontFamily: '"JetBrains Mono", monospace' }}>Get Long</div>
          <div style={{ marginTop: 4, fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 0.95, color: cream,
            whiteSpace: 'nowrap' }}>Speed Training.</div>
        </div>
        <div style={{ textAlign: 'right', flex: '0 0 auto', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 22, fontWeight: 700, color: citron,
            letterSpacing: '-0.01em',
            textShadow: '0 0 14px rgba(207,222,80,0.4)' }}>127</div>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.2em',
            color: 'rgba(251,246,230,0.6)', whiteSpace: 'nowrap' }}>
            DRIVER PR
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 14 }}>
        <TabSegDark active={2}/>
      </div>
    </div>
  );

  // ─── Compact section heading for Max Out ─────────────────────────
  const SectionHeading = ({ progress = '1 / 2' }) => (
    <div style={{ padding: '14px 18px 4px',
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', gap: 14 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10, fontWeight: 700, color: sub,
          letterSpacing: '0.24em' }}>DRILL · 3 OF 3</div>
        <div style={{ marginTop: 3, fontSize: 22, fontWeight: 800,
          letterSpacing: '-0.03em', color: ink, lineHeight: 1 }}>
          Max Out.
        </div>
        <div style={{ marginTop: 3, fontSize: 12, fontWeight: 500,
          color: sub, lineHeight: 1.35 }}>
          Green stick + driver · swing 3× max · best wins
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
          letterSpacing: '0.22em' }}>READINGS</span>
      </div>
    </div>
  );

  // ─── Bottom dots (half on / half off — same as V1) ───────────────
  const BottomDots = ({ done = 0, total = 3, color = forest }) => (
    <div style={{ position: 'absolute',
      bottom: 0, left: '50%',
      transform: 'translate(-50%, 50%)',
      background: paper, padding: '4px 8px', borderRadius: 99,
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

  // ─── Driver-head mark (small black club silhouette) ──────────────
  const DriverHead = ({ size = 26 }) => (
    <svg width={size} height={size * 0.75} viewBox="0 0 26 20"
         style={{ display: 'block' }}>
      {/* simple driver-head wedge: bulbous on left, tapered face on right */}
      <path d="M3 11 Q3 4 10 4 Q18 4 22 8 Q24 10 22 12 Q18 16 10 16 Q3 16 3 11 Z"
            fill="#1f2622"/>
      <path d="M19 7 L22 9 L19 11 Z" fill="#3a4540"/>
      <circle cx="9" cy="10" r="1" fill="#cfde50"/>
    </svg>
  );

  // ─── Speed cell · ONE big readout per pillar ─────────────────────
  const SpeedCell = ({ value, isFocus, accent }) => {
    const filled = value != null;
    return (
      <div style={{
        background: isFocus ? accent + '15' : 'transparent',
        border: isFocus ? `2px solid ${forest}` : `1px dashed ${accent}66`,
        borderRadius: 12, padding: '14px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        position: 'relative' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, fontWeight: 700, color: sub,
          letterSpacing: '0.24em' }}>SPEED</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 40, fontWeight: 700,
          color: filled || isFocus ? greenDeep : 'rgba(14,33,24,0.22)',
          letterSpacing: '-0.025em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1 }}>
          {filled ? value : '— — —'}
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, fontWeight: 600, color: sub,
          letterSpacing: '0.1em' }}>mph</span>
      </div>
    );
  };

  // ─── Green stick pillar · stick-form ─────────────────────────────
  const GreenStickPillar = ({ value, active, focus, swings }) => {
    const sc = stickGreen;
    return (
      <div style={{ flex: 1, position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* tee cap */}
        <div style={{ alignSelf: 'center',
          width: 22, height: 22, borderRadius: '50%',
          background: sc,
          border: active ? `2px solid ${citron}` : 'none',
          boxShadow: active
            ? `0 0 0 3px rgba(207,222,80,0.5), 0 4px 8px ${sc}55`
            : `0 2px 4px ${sc}55`,
          marginBottom: -2, zIndex: 2, position: 'relative' }}>
          {active && (
            <span style={{ position: 'absolute',
              top: -22, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `7px solid ${greenDeep}` }}/>
          )}
        </div>
        {/* grip band */}
        <div style={{ position: 'relative', background: sc,
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          padding: '8px 6px 7px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: `inset 0 -2px 0 ${sc}99` }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.005em',
            textShadow: '0 1px 0 rgba(0,0,0,0.15)' }}>Green Stick</span>
        </div>
        {/* shaft */}
        <div style={{ flex: 1, position: 'relative',
          background: active ? '#fff' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${active ? sc : rule}`, borderTop: 'none',
          borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
          padding: '14px 8px 18px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          boxShadow: active
            ? `0 12px 22px rgba(17,55,31,0.14), 0 0 0 2px ${sc}33`
            : 'none' }}>
          <div style={{ position: 'absolute', top: 6, bottom: 18,
            left: '50%', width: 1, background: `${sc}22`,
            transform: 'translateX(-0.5px)' }}/>
          <SpeedCell value={value} isFocus={focus} accent={sc}/>
          <BottomDots done={swings} color={sc}/>
        </div>
      </div>
    );
  };

  // ─── Driver pillar · darker treatment ────────────────────────────
  const DriverPillar = ({ value, active, focus, swings }) => {
    const sc = '#2a312d';      // graphite for driver
    const accentBand = greenDeep;
    return (
      <div style={{ flex: 1, position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* driver-head cap */}
        <div style={{ alignSelf: 'center',
          padding: '4px 6px',
          background: '#fff', borderRadius: 99,
          border: active ? `2px solid ${citron}` : `1px solid ${rule}`,
          boxShadow: active
            ? `0 0 0 3px rgba(207,222,80,0.5), 0 4px 8px rgba(14,33,24,0.2)`
            : '0 2px 4px rgba(14,33,24,0.12)',
          marginBottom: -4, zIndex: 2, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DriverHead size={26}/>
          {active && (
            <span style={{ position: 'absolute',
              top: -22, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `7px solid ${greenDeep}` }}/>
          )}
        </div>
        {/* grip band — graphite forest */}
        <div style={{ position: 'relative', background: accentBand,
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          padding: '8px 6px 7px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.25)` }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.005em',
            textShadow: '0 1px 0 rgba(0,0,0,0.2)' }}>Driver</span>
        </div>
        {/* shaft */}
        <div style={{ flex: 1, position: 'relative',
          background: active ? '#fff' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${active ? accentBand : rule}`, borderTop: 'none',
          borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
          padding: '14px 8px 18px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          boxShadow: active
            ? `0 12px 22px rgba(17,55,31,0.14), 0 0 0 2px rgba(17,55,31,0.18)`
            : 'none' }}>
          <div style={{ position: 'absolute', top: 6, bottom: 18,
            left: '50%', width: 1, background: 'rgba(17,55,31,0.16)',
            transform: 'translateX(-0.5px)' }}/>
          <SpeedCell value={value} isFocus={focus} accent={accentBand}/>
          <BottomDots done={swings} color={accentBand}/>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // MAX OUT SCREEN · V1 P3 style · Green Stick + Driver
  // ═══════════════════════════════════════════════════════════════════
  function MaxOutScreen() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column' }}>
        <ForestHeroMaxOut/>
        <SectionHeading progress="1 / 2"/>
        <div style={{ padding: '8px 16px 20px', flex: 1,
          display: 'flex', gap: 14, alignItems: 'stretch' }}>
          <GreenStickPillar value={117} active focus swings={2}/>
          <DriverPillar     value={null}                  swings={0}/>
        </div>
        <Keypad/>
        <CTABar label="Submit 117 mph" glyph="✓"/>
      </div>
    );
  }

  Object.assign(window, { MaxOutScreen });
})();
