// Build Strong · v6 · components · backgrounds
// Pixel-exact mirrors of every BS6 card background. Each background renders
// at the live card's W × H × radius, with the same photo + overlay stack and
// the same backgroundSize / backgroundPosition values used in BS6.
//
//   BS6-XS  · 460 × 43  · r24 · photo size 80% · position right 50% (Try 3)
//   BS6-S   · 460 × 124 · r24 · cover · center 40%
//   BS6-M   · 460 × 172 · r26 · cover · center 40%
//   BS6-L   · 460 × 245 · r28 · cover · center 40%
//   BS6-XL  · 460 × 332 · r30 · cover · center 40%

function BuildStrongV6Backgrounds() {
  const greenDeep = '#11371f';   // G2
  const green = '#1d4e34';       // G3
  const ink = '#10241a';
  const sub = '#6b756f';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';

  const PHOTO = 'assets/buildstrong-barbell.png';

  // Same 3-layer overlay stack as BS6. Anything dropped on top of this is
  // guaranteed to sit on the identical pixels as the live BS6 card.
  const BG = ({ width, height, radius, size = 'cover', position = 'center 40%' }) => (
    <div style={{
      width, height,
      position: 'relative', overflow: 'hidden', borderRadius: radius,
      background: greenDeep,
      boxShadow: `0 14px 30px rgba(17,55,31,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      {/* Photo */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${PHOTO})`,
        backgroundSize: size,
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
        filter: 'saturate(0.85) contrast(1.05)',
      }}/>
      {/* Vertical forest tint */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        background: `linear-gradient(180deg,
          rgba(10,24,18,0.78) 0%,
          rgba(17,55,31,0.62) 40%,
          rgba(17,55,31,0.48) 70%,
          rgba(17,55,31,0.72) 100%)`,
      }}/>
      {/* Diagonal green wash · multiply */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0,
        background: `linear-gradient(135deg, ${green}33 0%, ${greenDeep}55 100%)`,
        mixBlendMode: 'multiply',
      }}/>
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
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
          <Mono size={10.5} opacity={0.55}>{r[0]}</Mono>
          <Mono size={10.5} opacity={0.95}>{r[1]}</Mono>
        </div>
      ))}
    </div>
  );

  const sharedRows = [
    ['fill base',     `solid ${greenDeep} (visible if photo is shrunk)`],
    ['photo url',     `url(${PHOTO})`],
    ['photo filter',  'saturate(0.85) contrast(1.05)'],
    ['photo repeat',  'no-repeat'],
    ['shadow',        '0 14 30 rgba(17,55,31,.42)'],
    ['shadow ins.',   '0 1 0 rgba(255,255,255,.06)'],
    ['overlay v',     '180deg · 0.78 → 0.62 → 0.48 → 0.72 · forest'],
    ['overlay diag',  '135deg · G3@33 → G2@55 · mix-blend: multiply'],
  ];

  const Section = ({ header, bg, rows }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {header}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
        <div style={{ flexShrink: 0 }}>{bg}</div>
        <div style={{ flex: 1, minWidth: 0 }}><SpecBlock rows={rows}/></div>
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
            Build Strong · v6 · components · backgrounds
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            One background per size · pixel-exact mirror of BS6
          </div>
        </div>
        <Mono size={11} opacity={0.55}>derived from BS6</Mono>
      </div>

      {/* Cropped — Try 3 settings */}
      <Section
        header={<SectionHeader index="01" name="Cropped (XS · Try 3)" sizeId="BS6-XS"
          w={460} h={43} radius="24px" padding="12 × 16"/>}
        bg={<BG width={460} height={43} radius={24} size="80%" position="right 50%"/>}
        rows={[...sharedRows,
          ['photo size',     '80% (Try 3)'],
          ['photo position', 'right 50%'],
        ]}/>

      {/* Compact */}
      <Section
        header={<SectionHeader index="02" name="Compact (S)" sizeId="BS6-S"
          w={460} h={124} radius="24px" padding="14 × 18"/>}
        bg={<BG width={460} height={124} radius={24}/>}
        rows={[...sharedRows,
          ['photo size',     'cover'],
          ['photo position', 'center 40%'],
        ]}/>

      {/* Standard */}
      <Section
        header={<SectionHeader index="03" name="Standard (M)" sizeId="BS6-M"
          w={460} h={172} radius="26px" padding="18 × 20"/>}
        bg={<BG width={460} height={172} radius={26}/>}
        rows={[...sharedRows,
          ['photo size',     'cover'],
          ['photo position', 'center 40%'],
        ]}/>

      {/* Detailed */}
      <Section
        header={<SectionHeader index="04" name="Detailed (L)" sizeId="BS6-L"
          w={460} h={245} radius="28px" padding="20 × 22"/>}
        bg={<BG width={460} height={245} radius={28}/>}
        rows={[...sharedRows,
          ['photo size',     'cover'],
          ['photo position', 'center 40%'],
        ]}/>

      {/* Full / Expanded */}
      <Section
        header={<SectionHeader index="05" name="Full / Expanded + CTA (XL)" sizeId="BS6-XL"
          w={460} h={332} radius="30px" padding="22 × 22"/>}
        bg={<BG width={460} height={332} radius={30}/>}
        rows={[...sharedRows,
          ['photo size',     'cover'],
          ['photo position', 'center 40%'],
        ]}/>
    </div>
  );
}

window.BuildStrongV6Backgrounds = BuildStrongV6Backgrounds;
