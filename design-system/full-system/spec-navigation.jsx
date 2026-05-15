// Subpar · design system · NAVIGATION artboard
// Extracts the floating dark tab bar from screen-topo-v4 and documents its anatomy.

function SpecNavigation() {
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';
  const forest = '#1d4e34';
  const greenDeep = '#11371f';
  const citron = '#cfde50';
  const cream = '#fbf6e6';

  const Mono = ({ children, size = 11, color = ink, op = 1, weight = 600 }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity: op, fontWeight: weight }}>{children}</span>
  );

  const Eyebrow = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: sub }}>{children}</div>
  );

  const SectionHeader = ({ index, name, meta }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 16, paddingBottom: 10, borderBottom: `1px solid ${rule}` }}>
      <div>
        <Eyebrow>{index} · navigation</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
          marginTop: 2 }}>{name}</div>
      </div>
      <Mono size={10.5} op={0.55}>{meta}</Mono>
    </div>
  );

  // The canonical tab bar (3 tabs, "Today" wider when active)
  const TabBar = ({ activeIdx = 0, width = 354 }) => {
    const tabs = [
      { label: 'Today',      icon: 'checkCircle' },
      { label: 'Challenges', icon: 'flag' },
      { label: 'Stats',      icon: 'bars' },
    ];
    return (
      <div style={{ width, background: forest, borderRadius: 30, padding: 6,
        display: 'flex', gap: 4,
        boxShadow: '0 14px 30px rgba(29,78,52,0.30)' }}>
        {tabs.map((t, i) => {
          const active = i === activeIdx;
          return (
            <div key={t.label} style={{ flex: active ? 1.4 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 12px', borderRadius: 24,
              background: active ? citron : 'transparent',
              color: active ? forest : 'rgba(251,246,230,0.65)',
              fontWeight: active ? 800 : 600, fontSize: 13 }}>
              {I[t.icon]({ width: 18, height: 18 })}
              {active && <span>{t.label}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '36px 36px 48px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 14 }}>
        <div>
          <Eyebrow>Section 06 · navigation</Eyebrow>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}>
            Floating dark tab bar
          </div>
        </div>
        <Mono size={11} op={0.55}>from Topo v4 · 3 tabs · pill style</Mono>
      </div>

      {/* Default state — Today active */}
      <div>
        <SectionHeader index="06·a" name="Default · Today active"
          meta="active tab shows label · inactive icon-only"/>
        <div style={{ marginTop: 20, background: paper,
          border: `1px dashed ${rule}`, borderRadius: 16,
          padding: '32px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <TabBar activeIdx={0}/>
          <Mono size={10.5} op={0.5}>safe-area · 24px below · 18px side gutter</Mono>
        </div>
      </div>

      {/* States */}
      <div>
        <SectionHeader index="06·b" name="States" meta="one active at a time · 3 total tabs"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { i: 0, l: 'Today active' },
            { i: 1, l: 'Challenges active' },
            { i: 2, l: 'Stats active' },
          ].map(s => (
            <div key={s.i} style={{ background: '#fff', border: `1px solid ${rule}`,
              borderRadius: 16, padding: '20px 20px',
              display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
              <Eyebrow>{s.l}</Eyebrow>
              <TabBar activeIdx={s.i} width={300}/>
            </div>
          ))}
        </div>
      </div>

      {/* Anatomy */}
      <div>
        <SectionHeader index="06·c" name="Anatomy" meta="spacing · radius · color"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
          <div style={{ background: '#fff', border: `1px solid ${rule}`,
            borderRadius: 16, padding: '24px 24px',
            display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <TabBar activeIdx={0} width={354}/>
            <div style={{ width: '100%', display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                ['container bg',  'G3 forest #1d4e34'],
                ['container r',   '30px (pill)'],
                ['container pad', '6px all sides'],
                ['container gap', '4px between tabs'],
                ['tab pad',       '10 × 12px'],
                ['tab r',         '24px'],
                ['active bg',     'Y5 citron #cfde50'],
                ['active text',   'forest #1d4e34 · 800'],
                ['inactive text', 'cream @ 0.65 · 600'],
                ['active flex',   '1.4 vs 1.0'],
                ['icon size',     '18px · stroke 1.8'],
                ['icon-label gap','8px'],
                ['drop shadow',   '0 14 30 rgba(29,78,52,0.30)'],
                ['min-tap',       '44 × 44 (full tab)'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr',
                  gap: 8, padding: '6px 0', borderTop: i < 2 ? 'none' : `1px dashed ${rule}` }}>
                  <Mono size={10.5} op={0.55}>{k}</Mono>
                  <Mono size={10.5} op={0.95}>{v}</Mono>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${rule}`,
            borderRadius: 16, padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Eyebrow>Behavior rules</Eyebrow>
            <div style={{ fontSize: 13, color: ink, fontWeight: 600, lineHeight: 1.45 }}>
              Only the active tab shows its label.
            </div>
            <div style={{ fontSize: 12.5, color: sub, fontWeight: 500, lineHeight: 1.5 }}>
              Inactive tabs collapse to icon-only at flex&nbsp;1; active tab expands to flex&nbsp;1.4 to fit its label. This is the only visual difference between states — no underline, no dot, no border.
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: ink, fontWeight: 600, lineHeight: 1.45 }}>
              The bar floats.
            </div>
            <div style={{ fontSize: 12.5, color: sub, fontWeight: 500, lineHeight: 1.5 }}>
              18px side gutter, 24px above the home-indicator. Long screens scroll under it. Its dark forest pill is the visual anchor at the bottom of every screen.
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: ink, fontWeight: 600, lineHeight: 1.45 }}>
              Don't add a 4th tab.
            </div>
            <div style={{ fontSize: 12.5, color: sub, fontWeight: 500, lineHeight: 1.5 }}>
              The flex 1.4 / 1 / 1 ratio depends on three. If the IA grows, switch to a sheet, not a 4-tab bar.
            </div>
          </div>
        </div>
      </div>

      {/* In situ — phone preview */}
      <div>
        <SectionHeader index="06·d" name="In situ · on the Topo screen"
          meta="dark pill at bottom · sits above topo lines"/>
        <div style={{ marginTop: 14, background: '#e1eee4', borderRadius: 24,
          padding: '22px 22px', position: 'relative', overflow: 'hidden',
          height: 280, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          {/* faint topo lines */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}
               width="100%" height="100%" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#9eb59a" strokeWidth="0.9">
              <path d="M-50 60 C 140 30, 320 110, 660 50"/>
              <path d="M-50 110 C 140 80, 320 170, 660 100"/>
              <path d="M-50 170 C 140 140, 320 230, 660 160"/>
              <path d="M-50 230 C 140 200, 320 290, 660 220"/>
            </g>
          </svg>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <TabBar activeIdx={0} width={354}/>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SpecNavigation = SpecNavigation;
