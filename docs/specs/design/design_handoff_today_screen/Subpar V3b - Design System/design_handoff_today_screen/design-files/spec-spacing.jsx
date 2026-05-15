// Subpar · design system · SPACING, RADIUS, SHADOW artboard
// Radii derived from the card sizes; spacing from card paddings + gaps;
// shadows from the gradient cards and CTAs.

function SpecSpacing() {
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
        <Eyebrow>{index} · spacing</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
          marginTop: 2 }}>{name}</div>
      </div>
      <Mono size={10.5} op={0.55}>{meta}</Mono>
    </div>
  );

  const radii = [
    { tok: 'r/pill',  px: 99,  use: 'Pills, progress bar, segmented control' },
    { tok: 'r/xs',    px: 12,  use: 'Stat tiles, ghost button (compact)' },
    { tok: 'r/sm',    px: 14,  use: 'Stat tile (XL), inline button' },
    { tok: 'r/md',    px: 16,  use: 'Primary CTA, sticker tile' },
    { tok: 'r/lg',    px: 22,  use: 'Item row card, list block' },
    { tok: 'r/card-xs', px: 24, use: 'Card · XS, S' },
    { tok: 'r/card-m',  px: 26, use: 'Card · M' },
    { tok: 'r/card-l',  px: 28, use: 'Card · L' },
    { tok: 'r/card-xl', px: 30, use: 'Card · XL' },
  ];

  const spacings = [
    { tok: 'sp/1',  px: 3 },
    { tok: 'sp/2',  px: 4 },
    { tok: 'sp/3',  px: 6 },
    { tok: 'sp/4',  px: 8 },
    { tok: 'sp/5',  px: 10 },
    { tok: 'sp/6',  px: 12 },
    { tok: 'sp/7',  px: 14 },
    { tok: 'sp/8',  px: 16 },
    { tok: 'sp/9',  px: 18 },
    { tok: 'sp/10', px: 20 },
    { tok: 'sp/11', px: 22 },
    { tok: 'sp/12', px: 26 },
  ];

  const cardSizes = [
    { id: 'XS', w: 420, h: 43,  r: 24, pad: '12 × 16' },
    { id: 'S',  w: 420, h: 124, r: 24, pad: '14 × 18' },
    { id: 'M',  w: 420, h: 172, r: 26, pad: '18 × 20' },
    { id: 'L',  w: 420, h: 246, r: 28, pad: '20 × 22' },
    { id: 'XL', w: 420, h: 335, r: 30, pad: '22 × 22' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '36px 36px 48px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 14 }}>
        <div>
          <Eyebrow>Section 03 · spacing, radius, shadow</Eyebrow>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}>
            Card sizes, paddings, elevation
          </div>
        </div>
        <Mono size={11} op={0.55}>derived from BS6 / GLS9 / DI</Mono>
      </div>

      {/* Card size ladder */}
      <div>
        <SectionHeader index="03·a" name="Card size ladder" meta="XS → XL · 420 wide · r 24 → 30"/>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cardSizes.map(c => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 220px',
              alignItems: 'center', gap: 18 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: ink, letterSpacing: '-0.02em' }}>
                {c.id}
              </div>
              <div style={{
                width: c.w, height: c.h, borderRadius: c.r,
                background: `linear-gradient(135deg, ${forest} 0%, ${greenDeep} 100%)`,
                boxShadow: '0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)',
                position: 'relative',
                display: 'flex', alignItems: 'center', padding: '0 18px',
                color: cream,
              }}>
                <Mono size={11} color={cream} op={0.7}>{c.w} × {c.h} · r{c.r} · pad {c.pad}</Mono>
              </div>
              <div>
                <Mono size={11} op={0.55}>r/card-{c.id.toLowerCase() === 'xs' || c.id === 'S' ? 'xs' : c.id.toLowerCase()}</Mono>
                <div style={{ marginTop: 2, fontSize: 12, color: sub, fontWeight: 500 }}>
                  {c.id === 'XS' ? 'pill / status row' :
                   c.id === 'S'  ? 'compact · title + bar' :
                   c.id === 'M'  ? 'standard hero' :
                   c.id === 'L'  ? 'detailed · + metric strip' :
                                   'full · CTA + extended metrics'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radius tokens */}
      <div>
        <SectionHeader index="03·b" name="Radius tokens" meta="px · use"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {radii.map(r => (
            <div key={r.tok} style={{ background: '#fff', border: `1px solid ${rule}`,
              borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14,
              alignItems: 'center' }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: r.px,
                background: forest,
                flexShrink: 0,
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Mono size={12} op={0.9}>{r.tok}</Mono>
                <div style={{ marginTop: 1 }}>
                  <Mono size={10.5} op={0.55}>{r.px === 99 ? '99 (pill)' : `${r.px}px`}</Mono>
                </div>
                <div style={{ marginTop: 4, fontSize: 11.5, color: sub, fontWeight: 500,
                  lineHeight: 1.35 }}>{r.use}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing scale */}
      <div>
        <SectionHeader index="03·c" name="Spacing scale" meta="gaps · paddings · margins"/>
        <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${rule}`,
          borderRadius: 16, padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {spacings.map(s => (
            <div key={s.tok} style={{ display: 'grid', gridTemplateColumns: '120px 80px 1fr',
              gap: 14, alignItems: 'center' }}>
              <Mono size={12} op={0.85}>{s.tok}</Mono>
              <Mono size={11} op={0.55}>{s.px}px</Mono>
              <div style={{ height: 14, background: '#e8e2c5', borderRadius: 4, position: 'relative',
                overflow: 'hidden' }}>
                <div style={{ height: '100%', width: s.px * 2.4, background: citron, borderRadius: 4,
                  boxShadow: `0 0 8px ${citron}88` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elevation */}
      <div>
        <SectionHeader index="03·d" name="Elevation · shadows" meta="cards · CTAs · glow"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            {
              tok: 'sh/row',
              val: '0 4 14 rgba(29,78,52,0.06)',
              use: 'List rows on cream (Speed Sticks / Driver)',
              bg: '#fff', radius: 22, height: 88,
              shadow: '0 4px 14px rgba(29,78,52,0.06)',
            },
            {
              tok: 'sh/card',
              val: '0 14 30 rgba(17,55,31,0.42) · inset 0 1 0 rgba(255,255,255,0.06)',
              use: 'Hero forest card · all sizes',
              bg: forest, radius: 28, height: 88,
              shadow: '0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)',
            },
            {
              tok: 'sh/cta',
              val: '0 12 24 rgba(207,222,80,0.35) · 0 0 0 4 rgba(207,222,80,0.18)',
              use: 'Primary CTA halo (citron on forest)',
              bg: citron, radius: 18, height: 88,
              shadow: '0 12px 24px rgba(207,222,80,0.35), 0 0 0 4px rgba(207,222,80,0.18)',
              outerBg: forest, padding: 10,
            },
          ].map(e => (
            <div key={e.tok} style={{ background: '#fff', border: `1px solid ${rule}`,
              borderRadius: 16, padding: '16px 16px' }}>
              <div style={{
                background: e.outerBg || paper,
                borderRadius: 14, padding: e.padding || 14, marginBottom: 12,
              }}>
                <div style={{ background: e.bg, height: e.height, borderRadius: e.radius,
                  boxShadow: e.shadow }}/>
              </div>
              <Mono size={12} op={0.9}>{e.tok}</Mono>
              <div style={{ marginTop: 4, fontSize: 12, color: sub, fontWeight: 500,
                lineHeight: 1.4 }}>{e.use}</div>
              <div style={{ marginTop: 6 }}>
                <Mono size={9.5} op={0.5}>{e.val}</Mono>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SpecSpacing = SpecSpacing;
