// Subpar · Pillars iterations · shared parts
// Forest hero, refined keypad, CTA, icons. Shared by all 3 variants.

(function () {
  const ink = '#0e2118';
  const sub = '#6b756f';
  const forest = '#1d4e34';
  const greenDeep = '#11371f';
  const g7 = '#6db483';
  const citron = '#cfde50';
  const cream = '#fbf6e6';
  const paper = '#f7f4ea';
  const rule  = '#e2dcc0';
  const clay  = '#cc6f4a';

  const SPColors = {
    ink, sub, forest, greenDeep, g7, citron, cream, paper, rule, clay,
    g8:  '#92cba2', g9:  '#bcdfc6',
    stickGreen: g7,
    stickBlue:  '#5e7eb8',
    stickRed:   clay,
  };

  const BackIcon = ({ s = 18, color = ink }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  const DeleteIcon = ({ s = 18, color = cream }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12 9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9z"/>
      <path d="m14 9-4 6M10 9l4 6"/>
    </svg>
  );

  const SkipIcon = ({ s = 18, color = sub }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5v14M19 12H8M14 7l5 5-5 5"/>
    </svg>
  );

  const StickRing = ({ color, size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.5" fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx="7" cy="7" r="2"   fill={color}/>
    </svg>
  );

  // ─── Forest hero with tab strip ──────────────────────────────────
  const TabSegDark = ({ active = 0 }) => {
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

  const ForestHero = ({ pr = '118' }) => (
    <div style={{ position: 'relative',
      background: `linear-gradient(160deg, ${forest} 0%, ${greenDeep} 100%)`,
      color: cream, padding: '54px 18px 16px',
      borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 390 200"
           preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke={g7} strokeWidth="0.9">
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
          DAY 1 · SESSION 3
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
            textShadow: '0 0 14px rgba(207,222,80,0.4)' }}>{pr}</div>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.2em',
            color: 'rgba(251,246,230,0.6)', whiteSpace: 'nowrap' }}>
            PR · MPH
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 14 }}>
        <TabSegDark active={0}/>
      </div>
    </div>
  );

  // ─── Refined keypad ──────────────────────────────────────────────
  const Keypad = () => {
    const NumCell = ({ children, citronAccent = false }) => (
      <div style={{ position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 24, fontWeight: 600, color: greenDeep,
        height: 56, letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums' }}>
        {children}
        {citronAccent && (
          <div style={{ position: 'absolute', bottom: 10, left: '50%',
            transform: 'translateX(-50%)', width: 18, height: 2,
            background: citron, borderRadius: 99 }}/>
        )}
      </div>
    );
    const SkipCell = () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <SkipIcon s={16} color={sub}/>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, fontWeight: 700, color: sub, letterSpacing: '0.16em' }}>
            NEXT
          </span>
        </div>
      </div>
    );
    const DelCell = () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 56 }}>
        <div style={{ background: greenDeep, color: cream,
          width: 56, height: 34, borderRadius: 10,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <DeleteIcon s={18}/>
        </div>
      </div>
    );
    return (
      <div style={{ background: paper, borderTop: `1px solid ${rule}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {['1','2','3','4','5','6','7','8','9'].map((n, i) => (
            <div key={n} style={{
              borderRight: (i % 3 !== 2) ? `1px solid ${rule}` : 'none',
              borderBottom: `1px solid ${rule}` }}>
              <NumCell>{n}</NumCell>
            </div>
          ))}
          <div style={{ borderRight: `1px solid ${rule}` }}><SkipCell/></div>
          <div style={{ borderRight: `1px solid ${rule}` }}>
            <NumCell citronAccent>0</NumCell>
          </div>
          <div><DelCell/></div>
        </div>
      </div>
    );
  };

  const CTABar = ({ label = 'Log 117 mph', glyph = '→' }) => (
    <div style={{ padding: '12px 18px 22px',
      borderTop: `1px solid ${rule}`, background: '#fff' }}>
      <button style={{ width: '100%', background: citron, color: greenDeep,
        border: 'none', borderRadius: 16, padding: '15px 18px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 15.5, fontWeight: 800, letterSpacing: '-0.005em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        cursor: 'pointer',
        boxShadow: '0 10px 22px rgba(207,222,80,0.32), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
        <span>{label}</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 16, fontWeight: 700 }}>{glyph}</span>
      </button>
    </div>
  );

  Object.assign(window, {
    SPColors, ForestHero, Keypad, CTABar, StickRing,
    BackIcon, DeleteIcon, SkipIcon,
  });
})();
