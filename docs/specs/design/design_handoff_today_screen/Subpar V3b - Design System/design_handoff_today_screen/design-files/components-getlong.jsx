// "Get Long" components · Backgrounds
// Each card size's BACKGROUND, rendered as a pixel-exact mirror of the live
// card in GLS9 — same width, same height, same border radius, same shadow,
// same gradient, and the same tracer SVG (with its variant + lift) anchored
// from the top-right corner.

function GetLongComponents() {
  // Palette (shared with the cards)
  const greenDeep = '#11371f';   // G2
  const green = '#1d4e34';       // G3
  const g8 = '#92cba2';          // G8 — tracer lines
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';

  const TRACER_W = 420;
  const TRACER_H = 335;

  // ── Tracer variants (identical to GLS9 sources) ──────────────
  const TracersFull = ({ lift = 0 }) => (
    <svg style={{ position: 'absolute', top: -lift, right: 0,
      width: TRACER_W, height: TRACER_H, pointerEvents: 'none' }}
      viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
        strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
        strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 94 Q 80 12, 196 35" fill="none" stroke={g8} strokeWidth="1.4"
        strokeLinecap="round" opacity="0.7" strokeDasharray="3 6"
        vectorEffect="non-scaling-stroke"/>
      <path d="M 4 91 Q 93 3, 196 26" fill="none" stroke={g8} strokeWidth="1.3"
        strokeLinecap="round" opacity="0.62" strokeDasharray="3 7"
        vectorEffect="non-scaling-stroke"/>
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
        strokeLinecap="round" opacity="0.55" strokeDasharray="2 5"
        vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  const TracersCompact = ({ lift = 2 }) => (
    <svg style={{ position: 'absolute', top: -lift, right: 0,
      width: TRACER_W, height: TRACER_H, pointerEvents: 'none' }}
      viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
        strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
        strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 91 Q 93 3, 196 26" fill="none" stroke={g8} strokeWidth="1.3"
        strokeLinecap="round" opacity="0.62" strokeDasharray="3 7"
        vectorEffect="non-scaling-stroke"/>
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
        strokeLinecap="round" opacity="0.55" strokeDasharray="2 5"
        vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  const TracersCropped = ({ lift = 31 }) => (
    <svg style={{ position: 'absolute', top: -lift, right: 0,
      width: TRACER_W, height: TRACER_H, pointerEvents: 'none' }}
      viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="6"
        strokeLinecap="round" opacity="0.18" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 86 Q 90 0, 196 14" fill="none" stroke={g8} strokeWidth="2.2"
        strokeLinecap="round" opacity="0.95" vectorEffect="non-scaling-stroke"/>
      <path d="M 4 88 Q 95 -1, 196 17.5" fill="none" stroke={g8} strokeWidth="1.4"
        strokeLinecap="round" opacity="0.7" strokeDasharray="3 6"
        vectorEffect="non-scaling-stroke"/>
      <path d="M 4 90 Q 100 -2, 196 21" fill="none" stroke={g8} strokeWidth="1.2"
        strokeLinecap="round" opacity="0.55" strokeDasharray="2 5"
        vectorEffect="non-scaling-stroke"/>
    </svg>
  );

  // ── Background card (exact pixel mirror of the GLS9 card) ─────
  const BG = ({ width = 420, height, radius, Tracers, lift = 0 }) => (
    <div style={{
      width, height,
      position: 'relative', overflow: 'hidden', borderRadius: radius,
      background: `linear-gradient(135deg, ${green} 0%, ${greenDeep} 100%)`,
      boxShadow: `0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      <Tracers lift={lift}/>
    </div>
  );

  const Mono = ({ children, size = 11, color = ink, opacity = 1 }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity, fontWeight: 600 }}>{children}</span>
  );

  const SectionHeader = ({ index, name, sizeId, w, h, radius, padding }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 16, paddingBottom: 8, borderBottom: `1px solid ${rule}` }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: sub }}>{index} · background</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
          marginTop: 2 }}>{name}</div>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap',
        justifyContent: 'flex-end' }}>
        <Mono size={10.5} opacity={0.6}>{sizeId}</Mono>
        <Mono size={10.5} opacity={0.6}>{w} × {h}</Mono>
        <Mono size={10.5} opacity={0.6}>r {radius}</Mono>
        <Mono size={10.5} opacity={0.6}>pad {padding}</Mono>
      </div>
    </div>
  );

  const SpecBlock = ({ rows }) => (
    <div style={{ background: '#fbf9ef', border: `1px solid ${rule}`, borderRadius: 12,
      padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
          <Mono size={10.5} opacity={0.55}>{r[0]}</Mono>
          <Mono size={10.5} opacity={0.95}>{r[1]}</Mono>
        </div>
      ))}
    </div>
  );

  // Shared tracer spec rows
  const tracerCroppedRows = [
    ['svg',         '420 × 335 abs · top: −31 · right: 0'],
    ['lines',       '3 visible · middle dotted (y=26) removed in v8 cropped'],
    ['solid',       'M 4 86 Q 90 0, 196 14 · stroke G8 · w 2.2 · op .95'],
    ['solid glow',  'same path · w 6 · op .18'],
    ['btm dotted',  'M 4 88 Q 95 −1, 196 17.5 · w 1.4 · op .7 · dash 3 6'],
    ['top dotted',  'M 4 90 Q 100 −2, 196 21 · w 1.2 · op .55 · dash 2 5'],
  ];
  const tracerCompactRows = [
    ['svg',         '420 × 335 abs · top: −2 · right: 0'],
    ['lines',       '3 visible · bottom dotted (y=35) removed in v8'],
    ['solid',       'M 4 86 Q 90 0, 196 14 · stroke G8 · w 2.2 · op .95'],
    ['solid glow',  'same path · w 6 · op .18'],
    ['mid dotted',  'M 4 91 Q 93 3, 196 26 · w 1.3 · op .62 · dash 3 7'],
    ['top dotted',  'M 4 90 Q 100 −2, 196 21 · w 1.2 · op .55 · dash 2 5'],
  ];
  const tracerFullRows = [
    ['svg',         '420 × 335 abs · top: 0 · right: 0'],
    ['lines',       '4 (solid + 3 dotted echoes)'],
    ['solid',       'M 4 86 Q 90 0, 196 14 · stroke G8 · w 2.2 · op .95'],
    ['solid glow',  'same path · w 6 · op .18'],
    ['btm dotted',  'M 4 94 Q 80 12, 196 35 · w 1.4 · op .7 · dash 3 6'],
    ['mid dotted',  'M 4 91 Q 93 3, 196 26 · w 1.3 · op .62 · dash 3 7'],
    ['top dotted',  'M 4 90 Q 100 −2, 196 21 · w 1.2 · op .55 · dash 2 5'],
  ];
  const sharedFillRows = [
    ['gradient',    'linear-gradient(135deg, #1d4e34 0% → #11371f 100%)'],
    ['palette',     'G3 → G2'],
    ['shadow',      '0 14 30 rgba(17,55,31,.42)'],
    ['shadow ins.', '0 1 0 rgba(255,255,255,.06)'],
    ['stroke color','G8 #92cba2 · vector-effect: non-scaling-stroke'],
  ];

  // ── Sections ─────────────────────────────────────────────────
  const Section = ({ header, bg, rows }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {header}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
        <div style={{ flexShrink: 0 }}>{bg}</div>
        <div style={{ flex: 1 }}><SpecBlock rows={rows}/></div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: '100%', background: paper, color: ink,
      fontFamily: '"Outfit", system-ui, sans-serif',
      padding: '36px 36px 48px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 32 }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${rule}`, paddingBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: sub }}>
            Get Long · components · backgrounds
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            One background per size · pixel-exact mirror of GLS9
          </div>
        </div>
        <Mono size={11} opacity={0.55}>derived from GLS9</Mono>
      </div>

      {/* Cropped */}
      <Section
        header={<SectionHeader index="01" name="Cropped" sizeId="GLS9-XS"
          w={420} h={43} radius="24px" padding="12 × 16"/>}
        bg={<BG width={420} height={43} radius={24} Tracers={TracersCropped} lift={31}/>}
        rows={[...sharedFillRows, ...tracerCroppedRows]}/>

      {/* Compact */}
      <Section
        header={<SectionHeader index="02" name="Compact" sizeId="GLS9-S"
          w={420} h={124} radius="24px" padding="14 × 18"/>}
        bg={<BG width={420} height={124} radius={24} Tracers={TracersCompact} lift={2}/>}
        rows={[...sharedFillRows, ...tracerCompactRows]}/>

      {/* Standard */}
      <Section
        header={<SectionHeader index="03" name="Standard" sizeId="GLS9-M"
          w={420} h={172} radius="26px" padding="18 × 20"/>}
        bg={<BG width={420} height={172} radius={26} Tracers={TracersFull} lift={0}/>}
        rows={[...sharedFillRows, ...tracerFullRows]}/>

      {/* Detailed */}
      <Section
        header={<SectionHeader index="04" name="Detailed" sizeId="GLS9-L"
          w={420} h={246} radius="28px" padding="20 × 22"/>}
        bg={<BG width={420} height={246} radius={28} Tracers={TracersFull} lift={0}/>}
        rows={[...sharedFillRows, ...tracerFullRows]}/>

      {/* Full / Expanded */}
      <Section
        header={<SectionHeader index="05" name="Full / Expanded + CTA" sizeId="GLS9-XL"
          w={420} h={335} radius="30px" padding="22 × 22"/>}
        bg={<BG width={420} height={335} radius={30} Tracers={TracersFull} lift={0}/>}
        rows={[...sharedFillRows, ...tracerFullRows]}/>
    </div>
  );
}

window.GetLongComponents = GetLongComponents;
