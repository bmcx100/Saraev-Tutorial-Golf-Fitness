// Subpar · Settings screen
// Adapted to the Build Strong design system: paper + forest + citron, with
// clay reserved for the Dev Tools accent and destructive actions.
//
// Exports a SettingsScreen component that takes `expanded` — 'none' |
// 'tracking' | 'notifications' | 'preferences' | 'account' | 'dev'.

(function () {
  const { SPColors } = window;
  const { ink, sub, forest, greenDeep, citron, cream, paper, rule, clay } = SPColors;

  // ─── Icons ───────────────────────────────────────────────────────
  const Arrow = ({ s = 18, color = ink }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
  const Sliders = ({ s = 14, color = sub }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M18 18h2"/>
      <circle cx="16" cy="6"  r="2" fill={color} stroke="none"/>
      <circle cx="8"  cy="12" r="2" fill={color} stroke="none"/>
      <circle cx="16" cy="18" r="2" fill={color} stroke="none"/>
    </svg>
  );
  const Gear = ({ s = 14, color = sub }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  );
  const Check = ({ s = 12, color = '#fff', w = 3.2 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7"/>
    </svg>
  );
  const SignOut = ({ s = 16, color = clay }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <path d="m16 17 5-5-5-5M21 12H9"/>
    </svg>
  );

  // ─── Emoji-style icons for tracking items (use simple SVG glyphs) ──
  // Match the row-icon look in the screenshot: line-only, sub-color.
  const RowGlyph = ({ kind }) => {
    const c = ink, w = 1.8;
    const S = (children) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    );
    switch (kind) {
      case 'bolt':    return S(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>);
      case 'driver':  return S(<><path d="M8 21h8"/><path d="M12 21V8"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M10 5h4"/></>);
      case 'tee':     return S(<><circle cx="12" cy="8" r="3.5"/><path d="M9 11l-2 6M15 11l2 6"/><path d="M7 21h10"/></>);
      case 'runner':  return S(<><circle cx="14" cy="4.5" r="1.5"/><path d="m6 19 3-5 3 2 2-4 4 3"/><path d="m8 11 3-3 3 2"/></>);
      case 'cardio':  return S(<><path d="M3 12h3l2-6 4 12 2-6h3"/><path d="M18 12h3"/></>);
      case 'core':    return S(<><circle cx="12" cy="5" r="2"/><path d="M12 8v8"/><path d="m8 21 4-5 4 5"/><path d="m9 13 3-1 3 1"/></>);
      case 'meal':    return S(<><path d="M7 2v9a2 2 0 0 0 2 2v9"/><path d="M5 2v6M9 2v6"/><path d="M17 2c-2 1-3 4-3 7s1 4 3 4v9"/></>);
      case 'water':   return S(<path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/>);
      case 'cocktail':return S(<><path d="M5 4h14l-7 8z"/><path d="M12 12v8M8 20h8"/></>);
      case 'moon':    return S(<path d="M20 14.5A8 8 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>);
      case 'confetti':return S(<><path d="M3 21 11 9"/><path d="M5 17a4 4 0 0 1 4-4"/><path d="M13 3v3M17 6l2-2M20 9h-3M18 15l2 1M14 17l1 2"/></>);
      case 'checks':  return S(<><path d="m3 13 4 4L17 7"/><path d="m12 17 5 4 4-12"/></>);
      case 'trophy':  return S(<><path d="M6 4h12v4a6 6 0 0 1-12 0z"/><path d="M6 6H3a3 3 0 0 0 3 3M18 6h3a3 3 0 0 1-3 3"/><path d="M10 14h4v3l2 3H8l2-3z"/></>);
      case 'chart':   return S(<><path d="m3 17 4-6 4 3 5-8 5 7"/></>);
      case 'bars':    return S(<><rect x="3" y="12" width="4" height="9"/><rect x="10" y="6" width="4" height="15"/><rect x="17" y="3" width="4" height="18"/></>);
      case 'reset':   return S(<><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></>);
      case 'trash':   return S(<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/></>);
      default:        return S(<circle cx="12" cy="12" r="6"/>);
    }
  };

  // ─── Section icons (per category) — render in forest tile ────────
  const SectionIcon = ({ kind, color = citron, s = 16 }) => {
    const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
      stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (kind) {
      case 'tracking':
        return (<svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill={color} stroke="none"/></svg>);
      case 'notifications':
        return (<svg {...common}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>);
      case 'preferences':
        return (<svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>);
      case 'account':
        return (<svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>);
      case 'dev':
        return (<svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 10 2 2-2 2M12 14h4"/></svg>);
      default:
        return null;
    }
  };

  // ─── Section header (collapsed/expanded) ─────────────────────────
  // Expanded: forest tile + per-category glyph + uppercase label.
  // Collapsed: paper-tinted strip, label only, sliders icon on the right.
  const SectionHeader = ({ label, icon, accent, open }) => {
    const color = accent || sub;
    if (!open) {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.22em',
            color, textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
          <Sliders s={15} color={color}/>
        </div>
      );
    }
    // Expanded — forest icon tile header (treatment B)
    const tileBg     = accent ? accent : greenDeep;
    const tileGlyph  = accent ? cream  : citron;
    const labelColor = accent ? accent : greenDeep;
    return (
      <div style={{
        background: paper,
        padding: '10px 12px 10px 10px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${rule}`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: tileBg,
          display: 'grid', placeItems: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
        }}>
          <SectionIcon kind={icon} color={tileGlyph}/>
        </div>
        <span style={{
          flex: 1,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.22em',
          color: labelColor, textTransform: 'uppercase',
        }}>
          {label}
        </span>
        <Sliders s={15} color={sub}/>
      </div>
    );
  };

  // ─── Section wrapper ─────────────────────────────────────────────
  const Section = ({ label, icon, accent, open, children }) => (
    <div style={{
      background: open ? '#fff' : paper,
      border: `1px solid ${accent && !open ? accent : rule}`,
      borderRadius: 14,
      boxShadow: open ? '0 10px 22px rgba(17,55,31,0.08)' : 'none',
      overflow: 'hidden',
    }}>
      <SectionHeader label={label} icon={icon} accent={accent} open={open}/>
      {open && (
        <div style={{ padding: '4px 16px 14px' }}>
          {children}
        </div>
      )}
    </div>
  );

  // ─── Toggle ──────────────────────────────────────────────────────
  const Toggle = ({ on = true }) => (
    <div style={{
      width: 44, height: 26, borderRadius: 99,
      background: on ? '#3aa57c' : '#cdd0c8',
      position: 'relative',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.10)',
    }}>
      <div style={{
        position: 'absolute',
        top: 2, left: on ? 20 : 2,
        width: 22, height: 22, borderRadius: 99,
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
      }}/>
    </div>
  );

  // ─── Tracking row (icon · label · gear · radio) ──────────────────
  const TrackingRow = ({ glyph, label, on = false, last = false }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${rule}`,
    }}>
      <RowGlyph kind={glyph}/>
      <span style={{
        flex: 1,
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 500, color: ink,
        letterSpacing: '-0.005em',
      }}>
        {label}
      </span>
      <Gear s={15} color={sub}/>
      <div style={{
        width: 18, height: 18, borderRadius: 99,
        background: on ? '#3aa57c' : '#fff',
        border: on ? 'none' : `1.5px solid #cdd0c8`,
        display: 'grid', placeItems: 'center',
        boxShadow: on ? '0 2px 4px rgba(58,165,124,0.30)' : 'none',
      }}>
        {on && <Check s={11} color="#fff" w={3.4}/>}
      </div>
    </div>
  );

  const TrackingGroup = ({ title, children }) => (
    <div>
      <div style={{
        marginTop: 12, marginBottom: 2,
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14, fontWeight: 800, color: ink,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </div>
      {children}
    </div>
  );

  // ─── Simple "label · value" row used by Notifications / Prefs ───
  const KVRow = ({ label, value, last }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${rule}`,
    }}>
      <span style={{
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 500, color: ink,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 14, fontWeight: 700, color: ink,
        letterSpacing: '0.04em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
  const ToggleRow = ({ label, on = true, last }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${rule}`,
    }}>
      <span style={{
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 500, color: ink,
      }}>
        {label}
      </span>
      <Toggle on={on}/>
    </div>
  );

  // ─── Dev tools rows ──────────────────────────────────────────────
  const DevRow = ({ glyph, label, last }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 0',
      borderBottom: last ? 'none' : `1px solid ${rule}`,
      cursor: 'pointer',
    }}>
      <RowGlyph kind={glyph}/>
      <span style={{
        flex: 1,
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 500, color: ink,
        letterSpacing: '-0.005em',
      }}>
        {label}
      </span>
    </div>
  );

  const DayStepper = () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 0',
    }}>
      <button style={{
        flex: '0 0 auto',
        background: 'rgba(58,165,124,0.14)', color: '#246b4f',
        border: 'none', borderRadius: 10, padding: '8px 14px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
        cursor: 'pointer',
      }}>
        − Day
      </button>
      <div style={{
        flex: 1, textAlign: 'center',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 800, color: ink,
      }}>
        Today
      </div>
      <button style={{
        flex: '0 0 auto',
        background: 'rgba(58,165,124,0.14)', color: '#246b4f',
        border: 'none', borderRadius: 10, padding: '8px 14px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
        cursor: 'pointer',
      }}>
        + Day
      </button>
    </div>
  );

  // ─── Destructive button (Sign Out / Reset / Clear) ───────────────
  const DangerBtn = ({ icon, label }) => (
    <button style={{
      width: '100%',
      background: '#fff', color: clay,
      border: `1.5px solid ${clay}`,
      borderRadius: 12, padding: '11px 14px',
      fontFamily: '"Outfit", system-ui, sans-serif',
      fontSize: 14, fontWeight: 800, letterSpacing: '-0.005em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer',
    }}>
      <RowGlyph kind={icon}/>
      <span style={{ marginLeft: -4 }}>{label}</span>
    </button>
  );
  // Override RowGlyph colour for danger buttons by wrapping with a
  // tiny inline svg variant — simpler to redefine with stroke=clay:
  const DangerBtnReal = ({ kind, label }) => {
    const Icn = () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={clay} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'reset' && <><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></>}
        {kind === 'trash' && <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/></>}
        {kind === 'signout' && <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></>}
      </svg>
    );
    return (
      <button style={{
        width: '100%',
        background: '#fff', color: clay,
        border: `1.5px solid ${clay}`,
        borderRadius: 12, padding: '11px 14px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14, fontWeight: 800, letterSpacing: '-0.005em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
      }}>
        <Icn/>
        <span>{label}</span>
      </button>
    );
  };

  // ─── Top chrome ──────────────────────────────────────────────────
  const TopBar = () => (
    <div style={{
      padding: '54px 18px 6px',
      display: 'grid',
      gridTemplateColumns: '36px 1fr 36px',
      alignItems: 'center',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16,
        display: 'grid', placeItems: 'center',
        cursor: 'pointer',
      }}>
        <Arrow s={18} color={ink}/>
      </div>
      <div style={{
        textAlign: 'center',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 17, fontWeight: 800, color: ink, letterSpacing: '-0.02em',
      }}>
        Settings
      </div>
      <div/>
    </div>
  );

  const Hint = () => (
    <div style={{
      textAlign: 'center',
      padding: '6px 18px 14px',
      fontFamily: '"Outfit", system-ui, sans-serif',
      fontSize: 12.5, fontWeight: 500, color: sub,
      letterSpacing: '-0.005em',
    }}>
      Expand a topic to edit settings
    </div>
  );

  // ─── Body builders for each expanded state ───────────────────────
  const TrackingBody = () => (
    <div>
      <TrackingGroup title="Golf">
        <TrackingRow glyph="bolt"   label="Speed Training" on/>
        <TrackingRow glyph="driver" label="Driver"/>
        <TrackingRow glyph="tee"    label="Putting" last/>
      </TrackingGroup>
      <TrackingGroup title="Workouts">
        <TrackingRow glyph="runner" label="Strength Training" on/>
        <TrackingRow glyph="cardio" label="Cardio"/>
        <TrackingRow glyph="core"   label="Core" last/>
      </TrackingGroup>
      <TrackingGroup title="Lifestyle">
        <TrackingRow glyph="meal"     label="Meals"/>
        <TrackingRow glyph="water"    label="H2O"/>
        <TrackingRow glyph="cocktail" label="Alcohol"/>
        <TrackingRow glyph="moon"     label="Sleep" last/>
      </TrackingGroup>
    </div>
  );

  const NotificationsBody = () => (
    <div>
      <ToggleRow label="Enable notifications" on/>
      <KVRow    label="Morning reminder" value="08:00"/>
      <KVRow    label="Evening check-in" value="20:00" last/>
    </div>
  );

  const PreferencesBody = () => (
    <div>
      <ToggleRow label="Sound effects" on last/>
    </div>
  );

  const AccountBody = () => (
    <div>
      <div style={{
        padding: '4px 0 12px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 14.5, fontWeight: 500, color: ink,
        letterSpacing: '-0.005em',
      }}>
        hurstryan1@gmail.com
      </div>
      <DangerBtnReal kind="signout" label="Sign Out"/>
    </div>
  );

  const DevBody = () => (
    <div>
      <DevRow glyph="confetti" label="Test Confetti"/>
      <DevRow glyph="checks"   label="Complete All Today's Habits"/>
      <DevRow glyph="trophy"   label="Force Complete Challenge"/>
      <DayStepper/>
      <div style={{ height: 1, background: rule, margin: '2px 0 2px' }}/>
      <DevRow glyph="chart"    label="Generate 7-Day Streak"/>
      <DevRow glyph="chart"    label="Generate 30-Day Streak"/>
      <DevRow glyph="bars"     label="Rebuild Stats" last/>

      <div style={{
        marginTop: 12, marginBottom: 6,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
        color: clay, textTransform: 'uppercase',
      }}>
        Data
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <DangerBtnReal kind="reset" label="Reset Today's Progress"/>
        <DangerBtnReal kind="trash" label="Clear All Data"/>
      </div>
    </div>
  );

  // ─── Main composer ────────────────────────────────────────────────
  function SettingsScreen({ expanded = 'none' }) {
    const sectionOrder = [
      { id: 'tracking',      label: 'Tracking',      icon: 'tracking',      accent: null,  body: <TrackingBody/> },
      { id: 'notifications', label: 'Notifications', icon: 'notifications', accent: null,  body: <NotificationsBody/> },
      { id: 'preferences',   label: 'Preferences',   icon: 'preferences',   accent: null,  body: <PreferencesBody/> },
      { id: 'account',       label: 'Account',       icon: 'account',       accent: null,  body: <AccountBody/> },
      { id: 'dev',           label: 'Dev Tools',     icon: 'dev',           accent: clay,  body: <DevBody/> },
    ];

    return (
      <div data-screen-label={`Settings · ${expanded}`}
        style={{
          width: '100%', height: '100%',
          background: '#fff', color: ink,
          fontFamily: '"Outfit", system-ui, sans-serif',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
        <TopBar/>
        <Hint/>
        <div style={{
          padding: '0 14px 18px',
          display: 'flex', flexDirection: 'column', gap: 10,
          overflow: 'auto', flex: 1,
        }}>
          {sectionOrder.map(s => (
            <Section key={s.id} label={s.label} icon={s.icon} accent={s.accent} open={expanded === s.id}>
              {s.body}
            </Section>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window, { SettingsScreen });
})();
