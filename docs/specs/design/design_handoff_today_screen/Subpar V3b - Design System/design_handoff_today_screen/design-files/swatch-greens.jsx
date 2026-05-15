// Green swatch palette — dark→light variations of the "Get Long" card background.
// Each swatch is labeled G1..G10 so the user can refer to them by name.

function GreenSwatches() {
  const greens = [
    { id: 'G1',  hex: '#0a2515' },
    { id: 'G2',  hex: '#11371f' },
    { id: 'G3',  hex: '#1d4e34', note: 'Current Topo' },
    { id: 'G4',  hex: '#2a6243' },
    { id: 'G5',  hex: '#387b54' },
    { id: 'G6',  hex: '#4f9869' },
    { id: 'G7',  hex: '#6db483' },
    { id: 'G8',  hex: '#92cba2' },
    { id: 'G9',  hex: '#bcdfc6' },
    { id: 'G10', hex: '#e1eee4' },
  ];

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
            Get Long · background palette
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 4 }}>
            Greens · dark to light
          </div>
        </div>
        <div style={{ fontSize: 12, color: sub, fontWeight: 500 }}>10 steps · refer by ID</div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 14, flex: 1 }}>
        {greens.map((g, i) => {
          // pick a label color that has contrast against the swatch
          const labelOnDark = i < 6;
          const labelColor = labelOnDark ? '#ffffff' : ink;
          const labelOpacity = labelOnDark ? 0.95 : 0.85;
          return (
            <div key={g.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                aspectRatio: '1 / 1', background: g.hex, borderRadius: 16,
                position: 'relative', boxShadow: '0 6px 14px rgba(16,36,26,0.10)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '10px 12px',
                border: i === 9 ? '1px solid #d6d0b3' : 'none',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em',
                  color: labelColor, opacity: labelOpacity }}>
                  {g.id}
                </div>
                <div style={{ fontSize: 10.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontWeight: 600, color: labelColor, opacity: labelOpacity * 0.85 }}>
                  {g.hex}
                </div>
                {g.note && (
                  <div style={{ position: 'absolute', top: 8, right: 8,
                    fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em',
                    padding: '2px 6px', borderRadius: 99,
                    background: labelOnDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.10)',
                    color: labelColor, textTransform: 'uppercase' }}>
                    ★ {g.note}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: sub, fontWeight: 500, textAlign: 'center' }}>
                {g.id === 'G1' ? 'darkest' : g.id === 'G10' ? 'lightest' : `step ${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview: what the card looks like with each */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: sub, marginBottom: 8 }}>
          Card preview (text mockup)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {greens.map((g, i) => {
            const dark = i < 6;
            const text = dark ? '#fff' : ink;
            const sub2 = dark ? 'rgba(255,255,255,0.7)' : 'rgba(16,36,26,0.55)';
            return (
              <div key={g.id} style={{ background: g.hex, borderRadius: 14, padding: '10px 11px',
                border: i === 9 ? '1px solid #d6d0b3' : 'none' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: sub2, letterSpacing: '0.12em',
                  textTransform: 'uppercase' }}>{g.id} · ACTIVE</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: '-0.02em',
                  marginTop: 2, lineHeight: 1 }}>Get Long</div>
                <div style={{ fontSize: 9, color: sub2, marginTop: 2 }}>1/12 · on track</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.GreenSwatches = GreenSwatches;
