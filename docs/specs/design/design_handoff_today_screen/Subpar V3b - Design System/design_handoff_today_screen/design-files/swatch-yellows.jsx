// Citron / yellow palette — used in the active "Get Long" pill, segmented progress lit
// states, and the active Today tab on the Topo nav bar. Labeled Y1..Y10 dark→light.

function YellowSwatches() {
  const yellows = [
    { id: 'Y1',  hex: '#5a6010' },
    { id: 'Y2',  hex: '#76801c' },
    { id: 'Y3',  hex: '#94a02a' },
    { id: 'Y4',  hex: '#b3c138' },
    { id: 'Y5',  hex: '#cfde50', note: 'Current Topo' },
    { id: 'Y6',  hex: '#d8e472' },
    { id: 'Y7',  hex: '#e1eb96' },
    { id: 'Y8',  hex: '#eaf2b8' },
    { id: 'Y9',  hex: '#f3f8d6' },
    { id: 'Y10', hex: '#faface' },
  ];

  // Dark forest used in the Topo card — for preview tiles
  const forest = '#1d4e34';
  const ink = '#10241a';
  const sub = '#6b756f';

  return (
    <div style={{ width: '100%', height: '100%', background: '#f7f4ea', color: ink,
      fontFamily: '"Outfit", "DM Sans", system-ui, sans-serif',
      padding: '28px 28px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: '1px solid #e2dcc0', paddingBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: sub }}>
            Get Long · accent yellow / citron palette
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            Yellows · dark to light
          </div>
        </div>
        <div style={{ fontSize: 12, color: sub, fontWeight: 500,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>10 steps · refer by ID</div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 14, flex: 1 }}>
        {yellows.map((y, i) => {
          // Y1–Y4 are dark enough for white text
          const labelOnDark = i < 4;
          const labelColor = labelOnDark ? '#ffffff' : ink;
          const labelOpacity = labelOnDark ? 0.95 : 0.9;
          return (
            <div key={y.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                aspectRatio: '1 / 1', background: y.hex, borderRadius: 16,
                position: 'relative', boxShadow: '0 6px 14px rgba(16,36,26,0.10)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '10px 12px',
                border: i >= 8 ? '1px solid #e8e4b8' : 'none',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em',
                  color: labelColor, opacity: labelOpacity }}>
                  {y.id}
                </div>
                <div style={{ fontSize: 10.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontWeight: 600, color: labelColor, opacity: labelOpacity * 0.85 }}>
                  {y.hex}
                </div>
                {y.note && (
                  <div style={{ position: 'absolute', top: 8, right: 8,
                    fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em',
                    padding: '2px 6px', borderRadius: 99,
                    background: labelOnDark ? 'rgba(255,255,255,0.22)' : 'rgba(16,36,26,0.12)',
                    color: labelColor, textTransform: 'uppercase' }}>
                    ★ {y.note}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: sub, fontWeight: 500, textAlign: 'center' }}>
                {y.id === 'Y1' ? 'darkest' : y.id === 'Y10' ? 'lightest' : `step ${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview: how each yellow reads on the forest hero + nav contexts */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: sub, marginBottom: 8 }}>
          On forest (active pill · nav tab)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {yellows.map((y, i) => {
            // active pill: yellow bg, forest text
            return (
              <div key={y.id} style={{ background: forest, borderRadius: 14, padding: '10px 10px',
                display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.12em', textTransform: 'uppercase' }}>{y.id}</div>
                {/* pill */}
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 4,
                  background: y.hex, color: forest, padding: '2px 7px', borderRadius: 99,
                  fontSize: 9, fontWeight: 800 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 4, background: forest }}/>
                  ACTIVE
                </div>
                {/* tab style */}
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 4,
                  background: y.hex, color: forest, padding: '3px 8px', borderRadius: 12,
                  fontSize: 9.5, fontWeight: 800 }}>
                  ★ Today
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.YellowSwatches = YellowSwatches;
