// Subpar · design system · TYPOGRAPHY artboard
// Outfit (display + UI) paired with JetBrains Mono (metadata + token IDs).
// Scale derived from card sizes in the v3 explorations.

function SpecTypography() {
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';
  const forest = '#1d4e34';

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
        <Eyebrow>{index} · typography</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
          marginTop: 2 }}>{name}</div>
      </div>
      <Mono size={10.5} op={0.55}>{meta}</Mono>
    </div>
  );

  // The display/UI scale we actually use, harvested from the cards
  const scale = [
    { tok: 'display/xxl', size: 64, line: 0.95, tr: '-0.04em', w: 800, use: 'Page hero · "Today" landing'    },
    { tok: 'display/xl',  size: 52, line: 0.92, tr: '-0.04em', w: 800, use: 'XL card title · "Get Long."'    },
    { tok: 'display/l',   size: 44, line: 0.95, tr: '-0.035em', w: 800, use: 'L card · screen lead'          },
    { tok: 'display/m',   size: 40, line: 0.95, tr: '-0.035em', w: 800, use: 'M card title'                  },
    { tok: 'title/l',     size: 32, line: 1.00, tr: '-0.03em',  w: 800, use: 'Stat readouts (mph · streak)'  },
    { tok: 'title/m',     size: 26, line: 1.00, tr: '-0.03em',  w: 800, use: 'S card title'                  },
    { tok: 'title/s',     size: 22, line: 1.05, tr: '-0.025em', w: 700, use: 'Section header · spec H2'      },
    { tok: 'body/lg',     size: 18, line: 1.30, tr: '-0.02em',  w: 700, use: 'XS card label · row title'     },
    { tok: 'body/md',     size: 14, line: 1.40, tr: '-0.01em',  w: 700, use: 'Buttons · primary copy'        },
    { tok: 'body/sm',     size: 13, line: 1.45, tr: '0',        w: 500, use: 'Card subtitle · meta line'     },
    { tok: 'body/xs',     size: 12, line: 1.40, tr: '0',        w: 600, use: 'Pill text · progress strip'    },
    { tok: 'caption',     size: 11, line: 1.30, tr: '0.04em',   w: 800, use: 'Active pill · status label'    },
    { tok: 'eyebrow',     size: 10.5, line: 1.20, tr: '0.22em', w: 800, use: 'UPPERCASE section eyebrow'    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '36px 36px 48px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 14 }}>
        <div>
          <Eyebrow>Section 02 · typography</Eyebrow>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 6 }}>
            Outfit + JetBrains Mono
          </div>
        </div>
        <Mono size={11} op={0.55}>2 families · 13 tokens</Mono>
      </div>

      {/* Families */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Outfit */}
        <div style={{ background: '#fff', border: `1px solid ${rule}`, borderRadius: 18,
          padding: '24px 24px' }}>
          <Eyebrow>Display + UI</Eyebrow>
          <div style={{ marginTop: 8, fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 0.95 }}>
            Outfit.
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <span style={{ fontSize: 18, fontWeight: 400 }}>400</span>
            <span style={{ fontSize: 18, fontWeight: 500 }}>500</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>600</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>700</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>800</span>
            <Mono size={11} op={0.55}>· Google Fonts</Mono>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: sub, fontWeight: 500 }}>
            Geometric sans with a slightly humanist feel. Soft enough to feel
            wellness-adjacent, tight enough at -0.04em tracking to read as athletic
            display. Used for all headlines, titles, body, buttons.
          </div>
        </div>

        {/* JetBrains Mono */}
        <div style={{ background: '#fff', border: `1px solid ${rule}`, borderRadius: 18,
          padding: '24px 24px' }}>
          <Eyebrow>Metadata</Eyebrow>
          <div style={{ marginTop: 8, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 46, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1 }}>
            JBMono.
          </div>
          <div style={{ marginTop: 10 }}>
            <Mono size={14}>500 · 600 · 700</Mono>
            <Mono size={11} op={0.55}> · Google Fonts</Mono>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: sub, fontWeight: 500 }}>
            For token IDs (GLS9-XL), MPH/lb units, hex values, dim specs, anything
            with a tabular-numeric obligation. Never for body or display copy.
          </div>
        </div>
      </div>

      {/* Scale table */}
      <div>
        <SectionHeader index="02·a" name="Type scale" meta="px · line-height · tracking · weight"/>
        <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${rule}`,
          borderRadius: 16, overflow: 'hidden' }}>
          {scale.map((s, i) => (
            <div key={s.tok} style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr 220px',
              gap: 16, padding: '14px 18px',
              borderTop: i === 0 ? 'none' : `1px solid ${rule}`,
              alignItems: 'center',
            }}>
              <div>
                <Mono size={11.5} op={0.85}>{s.tok}</Mono>
                <div style={{ marginTop: 2 }}>
                  <Mono size={10} op={0.5}>{s.size}/{s.line} · {s.tr}</Mono>
                </div>
              </div>
              <div style={{
                fontSize: Math.min(s.size, 44),
                lineHeight: s.line,
                letterSpacing: s.tr,
                fontWeight: s.w,
                color: ink,
                textTransform: s.tok === 'eyebrow' ? 'uppercase' : 'none',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {s.tok === 'eyebrow' ? 'active · hole 1'
                 : s.tok === 'caption' ? 'ACTIVE · LIVE · DAY 5'
                 : s.tok.startsWith('display') ? 'Get Long.'
                 : s.tok.startsWith('title') ? 'Drain It.'
                 : 'Speed sticks · 6 × 3 L/R'}
              </div>
              <div style={{ fontSize: 12, color: sub, fontWeight: 500, lineHeight: 1.35 }}>
                {s.use}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color rules */}
      <div>
        <SectionHeader index="02·b" name="Color & emphasis rules" meta="text color tokens"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { bg: '#fff', fg: ink, sub: sub, label: 'On paper / white' },
            { bg: forest, fg: '#fbf6e6', sub: 'rgba(251,246,230,0.65)', label: 'On forest (G3)' },
            { bg: '#bcdfc6', fg: ink, sub: '#3a5042', label: 'On sage (G9)' },
          ].map((c, i) => (
            <div key={i} style={{ background: c.bg, borderRadius: 16, padding: '20px 20px',
              border: c.bg === '#fff' ? `1px solid ${rule}` : 'none',
              boxShadow: c.bg === forest ? '0 12px 26px rgba(29,78,52,0.20)' : 'none' }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: c.sub }}>{c.label}</div>
              <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em',
                color: c.fg, lineHeight: 1 }}>
                Headline.
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: c.sub, fontWeight: 500 }}>
                Subtitle / supporting line · keeps 65%–70% opacity vs primary
              </div>
              <div style={{ marginTop: 14, fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11.5, fontWeight: 600, color: c.fg, opacity: 0.85 }}>
                fg {typeof c.fg === 'string' && c.fg.startsWith('#') ? c.fg : c.fg}<br/>
                sub {typeof c.sub === 'string' ? c.sub : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combo example */}
      <div>
        <SectionHeader index="02·c" name="In context · the canonical card title" meta="display/xl + JBMono unit"/>
        <div style={{ marginTop: 14, background: forest, color: '#fbf6e6',
          borderRadius: 28, padding: '26px 28px',
          boxShadow: '0 14px 30px rgba(29,78,52,0.28)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(251,246,230,0.65)' }}>
                Active · session 1
              </div>
              <div style={{ marginTop: 8, fontSize: 52, fontWeight: 800,
                letterSpacing: '-0.04em', lineHeight: 0.92 }}>
                Get Long.
              </div>
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500,
                color: 'rgba(251,246,230,0.7)' }}>
                Top clubhead speed · 12 sessions
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#cfde50',
                letterSpacing: '-0.035em', lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 18px rgba(207,222,80,0.4)' }}>
                118
              </div>
              <div style={{ marginTop: 4, fontFamily: '"JetBrains Mono", monospace',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.16em',
                color: 'rgba(251,246,230,0.65)' }}>
                MPH
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SpecTypography = SpecTypography;
