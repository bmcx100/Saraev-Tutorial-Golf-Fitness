// Subpar · design system · OVERVIEW artboard
// Sets the tone of the document: name, palette anchors, voice, who-uses-this.

function SpecOverview() {
  const greenDeep = '#11371f';   // G2
  const forest = '#1d4e34';      // G3
  const sage = '#bcdfc6';        // G9
  const citron = '#cfde50';      // Y5
  const cream = '#fbf6e6';
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';

  const Mono = ({ children, size = 11, color = ink, op = 1 }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity: op, fontWeight: 600 }}>{children}</span>
  );

  const Eyebrow = ({ children }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: sub }}>{children}</div>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '40px 44px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Big header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 18 }}>
        <div>
          <Eyebrow>Subpar · golf training · v3b</Eyebrow>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 0.95, marginTop: 8 }}>
            Design system.
          </div>
          <div style={{ marginTop: 8, fontSize: 16, color: sub, fontWeight: 500, maxWidth: 640 }}>
            Tokens, type, components and patterns for the Subpar app — extracted
            from the finalized v3b explorations. Built for designers extending
            the system; expects revisions.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <Mono size={11} op={0.55}>updated May 2026</Mono>
          <Mono size={11} op={0.55}>9 sections · 1 canvas</Mono>
        </div>
      </div>

      {/* Palette + Type anchors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Palette anchors */}
        <div style={{ borderRadius: 22, background: forest, padding: '26px 28px',
          color: cream, position: 'relative', overflow: 'hidden',
          boxShadow: '0 14px 30px rgba(29,78,52,0.24)' }}>
          {/* topo lines */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
               width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke={citron} strokeWidth="0.8">
              <path d="M-20 50 C 80 25, 200 90, 420 40"/>
              <path d="M-20 100 C 80 75, 200 150, 420 90"/>
              <path d="M-20 160 C 80 135, 200 220, 420 150"/>
              <path d="M-20 220 C 80 195, 200 280, 420 210"/>
            </g>
          </svg>
          <Eyebrow><span style={{ color: 'rgba(251,246,230,0.55)' }}>The canonical pairing</span></Eyebrow>
          <div style={{ position: 'relative', marginTop: 12, fontSize: 30, fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1 }}>
            Forest <span style={{ color: citron }}>+ citron</span> on cream.
          </div>
          <div style={{ position: 'relative', marginTop: 10, fontSize: 13, opacity: 0.78,
            fontWeight: 500, maxWidth: 480 }}>
            G3 forest carries weight (cards, hero, dark nav). Y5 citron is the
            <em> only </em>accent — active states, progress glow, primary CTA. Cream
            paper is the page surface.
          </div>
          <div style={{ position: 'relative', marginTop: 18, display: 'flex', gap: 10 }}>
            {[
              { id: 'G3', hex: '#1d4e34', label: 'forest' },
              { id: 'Y5', hex: '#cfde50', label: 'citron' },
              { id: 'PAPER', hex: '#f7f4ea', label: 'cream' },
              { id: 'INK', hex: '#10241a', label: 'ink' },
            ].map(c => (
              <div key={c.id} style={{ flex: 1, background: 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12,
                padding: '10px 12px' }}>
                <div style={{ width: '100%', height: 38, borderRadius: 8, background: c.hex,
                  marginBottom: 8 }}/>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '-0.01em' }}>{c.id}</div>
                <div style={{ marginTop: 1 }}>
                  <Mono size={9.5} color={cream} op={0.7}>{c.hex}</Mono>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type anchor */}
        <div style={{ borderRadius: 22, background: '#ffffff',
          border: `1px solid ${rule}`, padding: '26px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow>Typography · two-family system</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: '"Outfit", system-ui, sans-serif',
              fontSize: 54, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92 }}>
              Get Long.
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: sub, fontWeight: 500 }}>
              Outfit · 400 · 500 · 600 · 700 · 800
            </div>
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${rule}` }}>
            <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 14, fontWeight: 600, color: ink, letterSpacing: '0.02em' }}>
              GLS9-XL · 118 MPH · +2.4
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: sub, fontWeight: 500 }}>
              JetBrains Mono · token IDs, metrics, metadata
            </div>
          </div>
        </div>
      </div>

      {/* Pillars row */}
      <div>
        <Eyebrow>Three rules</Eyebrow>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            {
              n: '01',
              t: 'One yellow.',
              d: 'Y5 citron is the sole accent. Avoid introducing competing accents — vary saturation through opacity or stack on green instead.',
            },
            {
              n: '02',
              t: 'Forest carries weight.',
              d: 'Cards, hero, nav. G3 → G2 gradient at 135° is the canonical dark surface. Cream copy, citron emphasis.',
            },
            {
              n: '03',
              t: 'Tabular numerics.',
              d: 'Every metric — MPH, lb, day count, percentage — uses fontVariantNumeric: tabular-nums. Numbers must align column-to-column.',
            },
          ].map(p => (
            <div key={p.n} style={{ background: '#ffffff', border: `1px solid ${rule}`,
              borderRadius: 16, padding: '18px 18px' }}>
              <Mono size={10.5} op={0.5}>{p.n}</Mono>
              <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
                color: ink }}>{p.t}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: sub, fontWeight: 500, lineHeight: 1.45 }}>
                {p.d}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Index */}
      <div style={{ background: '#ffffff', border: `1px solid ${rule}`, borderRadius: 16,
        padding: '20px 22px' }}>
        <Eyebrow>What's in here</Eyebrow>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            ['01', 'Color', 'Greens · Yellows · Y5 focus'],
            ['02', 'Typography', 'Outfit + JetBrains Mono · scale'],
            ['03', 'Spacing & Radius', 'Card sizes · paddings · shadows'],
            ['04', 'Iconography', 'Line · fill · sizes'],
            ['05', 'Buttons & Pills', 'CTAs · pills · segmented · FAB'],
            ['06', 'Navigation', 'Floating dark tab bar'],
            ['07', 'Cards · Drain It', '5 sizes · putting accuracy'],
            ['08', 'Cards · Get Long', '5 sizes · speed training'],
            ['09', 'Cards · Build Strong', '5 sizes · resistance'],
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Mono size={11} op={0.55}>{n}</Mono>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: ink, letterSpacing: '-0.01em' }}>{t}</div>
                <div style={{ marginTop: 1, fontSize: 12, color: sub, fontWeight: 500 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SpecOverview = SpecOverview;
