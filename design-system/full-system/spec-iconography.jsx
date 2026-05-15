// Subpar · design system · ICONOGRAPHY artboard
// The I.* line+fill icon set, shown at the three canonical sizes (11 / 14 / 18 / 20),
// and in their contextual color treatments (citron-on-forest, forest-on-sage,
// ink-on-cream).

function SpecIconography() {
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';
  const forest = '#1d4e34';
  const greenDeep = '#11371f';
  const citron = '#cfde50';
  const cream = '#fbf6e6';
  const sage = '#bcdfc6';
  const clay = '#cc6f4a';

  const Mono = ({ children, size = 11, color = ink, op = 1, weight = 600 }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity: op, fontWeight: weight }}>{children}</span>
  );

  const Eyebrow = ({ children, color = sub }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
      textTransform: 'uppercase', color }}>{children}</div>
  );

  const SectionHeader = ({ index, name, meta }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 16, paddingBottom: 10, borderBottom: `1px solid ${rule}` }}>
      <div>
        <Eyebrow>{index} · iconography</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
          marginTop: 2 }}>{name}</div>
      </div>
      <Mono size={10.5} op={0.55}>{meta}</Mono>
    </div>
  );

  // ── Icon roster (all from icons.jsx)
  const lineIcons = [
    { name: 'gear',     use: 'Settings · header right' },
    { name: 'flag',     use: 'Challenges nav tab' },
    { name: 'check',    use: 'Inline complete' },
    { name: 'bars',     use: 'Stats nav tab' },
    { name: 'tee',      use: 'Driver / golf item' },
    { name: 'dumbbell', use: 'Workout / strength' },
    { name: 'arrow',    use: 'Forward · CTA hint' },
    { name: 'trend',    use: 'Stat trend up' },
  ];
  const fillIcons = [
    { name: 'flagFill',    use: 'Active challenge pill' },
    { name: 'bolt',        use: 'Speed / live indicator' },
    { name: 'checkCircle', use: 'Today tab · completion' },
    { name: 'spark',       use: 'Lifestyle / streak hint' },
  ];

  const IconTile = ({ name, size, bg, color, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 64, height: 64, borderRadius: 14, background: bg,
        display: 'grid', placeItems: 'center', color,
        border: bg === '#fff' ? `1px solid ${rule}` : 'none' }}>
        {I[name]({ width: size, height: size })}
      </div>
      <Mono size={10} op={0.55}>{label}</Mono>
    </div>
  );

  const IconRow = ({ icons, kind }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {icons.map((ic, i) => (
        <div key={ic.name} style={{
          display: 'grid',
          gridTemplateColumns: '160px 64px 64px 64px 64px 1fr',
          gap: 14, alignItems: 'center',
          padding: '14px 18px',
          borderTop: i === 0 ? 'none' : `1px solid ${rule}`,
        }}>
          <div>
            <Mono size={12} op={0.9}>I.{ic.name}</Mono>
            <div style={{ marginTop: 2 }}>
              <Mono size={10} op={0.5}>{kind}</Mono>
            </div>
          </div>
          {[11, 14, 18, 20].map(sz => (
            <div key={sz} style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10,
                background: paper, display: 'grid', placeItems: 'center', color: forest }}>
                {I[ic.name]({ width: sz, height: sz })}
              </div>
              <Mono size={9} op={0.5}>{sz}px</Mono>
            </div>
          ))}
          <div style={{ fontSize: 12, color: sub, fontWeight: 500, lineHeight: 1.4 }}>{ic.use}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '36px 36px 48px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 14 }}>
        <div>
          <Eyebrow>Section 04 · iconography</Eyebrow>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}>
            12 inline SVGs · two styles
          </div>
        </div>
        <Mono size={11} op={0.55}>currentColor · no external assets</Mono>
      </div>

      {/* Rules */}
      <div style={{ background: '#fff', border: `1px solid ${rule}`,
        borderRadius: 16, padding: '18px 20px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          ['Stroke 1.8 · linecap round', 'All line icons share the same stroke weight and rounded joins.'],
          ['Inherit via currentColor',   'Color icons by setting the parent\'s color — never hard-code.'],
          ['Pair with text · 6-8px gap', 'Inside pills: gap 6. Inside rows: gap 14. Always vertical-aligned to baseline.'],
        ].map(([t, d]) => (
          <div key={t}>
            <div style={{ fontSize: 14, fontWeight: 800, color: ink, letterSpacing: '-0.01em' }}>{t}</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: sub, fontWeight: 500, lineHeight: 1.45 }}>
              {d}
            </div>
          </div>
        ))}
      </div>

      {/* Line icons */}
      <div>
        <SectionHeader index="04·a" name="Line icons" meta="11 · 14 · 18 · 20 px"/>
        <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${rule}`,
          borderRadius: 16, overflow: 'hidden' }}>
          <IconRow icons={lineIcons} kind="line · 1.8 stroke"/>
        </div>
      </div>

      {/* Fill icons */}
      <div>
        <SectionHeader index="04·b" name="Fill icons" meta="11 · 14 · 18 · 20 px"/>
        <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${rule}`,
          borderRadius: 16, overflow: 'hidden' }}>
          <IconRow icons={fillIcons} kind="fill · solid"/>
        </div>
      </div>

      {/* Color treatments */}
      <div>
        <SectionHeader index="04·c" name="Color treatments" meta="canonical pairings"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { bg: '#fff',    color: forest, label: 'forest on paper', desc: 'Section icons · empty-state' },
            { bg: forest,    color: citron, label: 'citron on forest', desc: 'Active states · Today tab' },
            { bg: sage,      color: forest, label: 'forest on sage',   desc: 'Golf row icons (G9 fill)' },
            { bg: '#f1d9cc', color: clay,   label: 'clay on peach',    desc: 'Workout row icons' },
          ].map((p, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${rule}`,
              borderRadius: 16, padding: '18px 18px' }}>
              <div style={{ width: '100%', height: 84, borderRadius: 12, background: p.bg,
                color: p.color, display: 'grid', placeItems: 'center',
                border: p.bg === '#fff' ? `1px solid ${rule}` : 'none' }}>
                {I.flagFill({ width: 28, height: 28 })}
              </div>
              <div style={{ marginTop: 12 }}>
                <Mono size={11} op={0.85}>{p.label}</Mono>
              </div>
              <div style={{ marginTop: 3, fontSize: 12, color: sub, fontWeight: 500 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* In-context */}
      <div>
        <SectionHeader index="04·d" name="In context" meta="pill · row · nav"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {/* Pill */}
          <div style={{ background: '#fff', border: `1px solid ${rule}`,
            borderRadius: 16, padding: '20px 20px',
            display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Eyebrow>Active pill (Y5 · forest text)</Eyebrow>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start',
              alignItems: 'center', gap: 6,
              background: citron, color: forest, padding: '4px 10px', borderRadius: 99,
              fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>
              {I.flagFill({ width: 11, height: 11 })}
              ACTIVE · HOLE 1
            </div>
            <Mono size={10} op={0.5}>icon 11px · gap 6 · pad 4 × 10</Mono>
          </div>
          {/* List row */}
          <div style={{ background: '#fff', border: `1px solid ${rule}`,
            borderRadius: 16, padding: '20px 20px',
            display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Eyebrow>Row leading icon · sage chip</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', background: paper, borderRadius: 18,
              boxShadow: '0 4px 14px rgba(29,78,52,0.06)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 18,
                background: sage, color: forest,
                display: 'grid', placeItems: 'center' }}>
                {I.tee({ width: 14, height: 14 })}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: ink,
                  letterSpacing: '-0.01em' }}>Driver</div>
                <div style={{ fontSize: 11.5, color: sub, marginTop: 1, fontWeight: 500 }}>
                  6 × 3 · L/R
                </div>
              </div>
            </div>
            <Mono size={10} op={0.5}>icon 14px in 36-circle · gap 14 · row r 22</Mono>
          </div>
          {/* Nav */}
          <div style={{ background: '#fff', border: `1px solid ${rule}`,
            borderRadius: 16, padding: '20px 20px',
            display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Eyebrow>Nav tab · Today active</Eyebrow>
            <div style={{ background: forest, borderRadius: 30, padding: 6, display: 'flex',
              gap: 4, boxShadow: '0 14px 30px rgba(29,78,52,0.30)' }}>
              {[
                { i: 'checkCircle', l: 'Today', active: true },
                { i: 'flag', l: 'Challenges' },
                { i: 'bars', l: 'Stats' },
              ].map((t, i) => (
                <div key={i} style={{ flex: t.active ? 1.4 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '10px 12px', borderRadius: 24,
                  background: t.active ? citron : 'transparent',
                  color: t.active ? forest : 'rgba(251,246,230,0.65)',
                  fontWeight: t.active ? 800 : 600, fontSize: 12 }}>
                  {I[t.i]({ width: 16, height: 16 })}
                  {t.active && <span>{t.l}</span>}
                </div>
              ))}
            </div>
            <Mono size={10} op={0.5}>icon 16 / 18px · gap 8 · pill r 24</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SpecIconography = SpecIconography;
