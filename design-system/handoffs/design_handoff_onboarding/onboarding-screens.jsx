// onboarding-screens.jsx — Subpar v3b · onboarding flow redesign
// Three steps · default + active states, all rebuilt in the v3b language:
//   01 · How it works         (intro · brand mark + 4 step cards)
//   02 · Build your plan      (sectioned selectable list)
//   03 · Take a challenge     (two challenge cards · forest hero + clay)
//
// Shared chrome: mono eyebrow, big display title with terminal period,
// page dots, citron CTA pill. Active/selected uses forest border + sage
// tint + citron check.

(function () {
  const ink = '#0e2118';
  const sub = '#5d6e64';
  const muted = '#6b756f';
  const forest = '#1d4e34';
  const greenDeep = '#11371f';
  const grass = '#2f7a4d';
  const g7 = '#6db483';
  const g8 = '#92cba2';
  const g9 = '#bcdfc6';
  const g10 = '#e1eee4';
  const sage = '#dde9d4';
  const citron = '#cfde50';
  const cream = '#fbf6e6';
  const paper = '#f7f4ea';
  const rule = '#e2dcc0';
  const clay = '#cc6f4a';
  const flax = '#e6c772';

  // ─── Utility components ──────────────────────────────────────────
  const Mono = ({ children, size = 11, color = ink, op = 1, weight = 700, ls = '0.22em' }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity: op, fontWeight: weight, letterSpacing: ls }}>
      {children}
    </span>
  );

  const Eyebrow = ({ children, color = muted }) => (
    <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
      textTransform: 'uppercase', color }}>
      {children}
    </div>
  );

  // Topo lines bg
  const TopoLines = ({ color = '#9eb59a', opacity = 0.32, w = 390, h = 380 }) => (
    <svg style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
         width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}
         preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke={color} strokeWidth="0.9">
        <path d="M-50 60 C 80 30, 220 130, 460 50"/>
        <path d="M-50 110 C 80 80, 220 180, 460 100"/>
        <path d="M-50 180 C 100 150, 240 240, 460 180"/>
        <path d="M-50 250 C 120 220, 260 320, 460 260"/>
        <path d="M-50 320 C 80 290, 260 380, 460 330"/>
        <path d="M-50 390 C 80 360, 260 450, 460 400"/>
      </g>
    </svg>
  );

  // Concentric brand mark from sign-in screens
  const BrandMark = ({ size = 56, onDark = false }) => {
    const c = size / 2;
    const track = onDark ? 'rgba(251,246,230,0.22)' : 'rgba(29,78,52,0.22)';
    const stroke = onDark ? cream : forest;
    const r1 = size / 2 - 4;
    const r2 = r1 - 9;
    const r3 = r2 - 9;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r1} fill="none" stroke={track} strokeWidth="2"/>
        <circle cx={c} cy={c} r={r2} fill="none" stroke={track} strokeWidth="2"/>
        <circle cx={c} cy={c} r={r3} fill={citron}/>
        <path d={`M ${c - 0.5} ${c - r3 + 2} L ${c - 0.5} ${c + r3 - 4}`}
              stroke={greenDeep} strokeWidth="1.6" strokeLinecap="round"/>
        <path d={`M ${c} ${c - r3 + 3} L ${c + r3 - 4} ${c - r3 + 7} L ${c} ${c - r3 + 11} Z`}
              fill={greenDeep}/>
        <circle cx={c} cy={c} r={r1} fill="none" stroke={stroke} strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * r1 * 0.32} ${2 * Math.PI * r1}`}
                strokeLinecap="round"
                transform={`rotate(-78 ${c} ${c})`}/>
      </svg>
    );
  };

  // Page progress dots (1-indexed)
  const PageDots = ({ active = 1, count = 3 }) => (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => {
        const idx = i + 1;
        const isActive = idx === active;
        const isPast = idx < active;
        return (
          <span key={i} style={{
            width: isActive ? 22 : 6, height: 6, borderRadius: 6,
            background: isActive ? forest : (isPast ? g8 : rule),
            transition: 'all .2s',
          }}/>
        );
      })}
    </div>
  );

  // CTA pill — disabled state when canContinue=false
  const CTAButton = ({ label, canContinue = true, onDark = false }) => {
    const bg = canContinue ? citron : (onDark ? 'rgba(251,246,230,0.12)' : '#e6e1d3');
    const fg = canContinue ? greenDeep : (onDark ? 'rgba(251,246,230,0.4)' : '#a4a39a');
    const shadow = canContinue
      ? '0 10px 22px rgba(207,222,80,0.30), inset 0 1px 0 rgba(255,255,255,0.4)'
      : 'none';
    return (
      <button style={{ width: '100%', background: bg, color: fg, border: 'none',
        borderRadius: 16, padding: '16px 18px',
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: 15, fontWeight: 800, letterSpacing: '-0.005em',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: canContinue ? 'pointer' : 'not-allowed',
        boxShadow: shadow,
        opacity: 1 }}>
        <span style={{ flex: 1, textAlign: 'center', paddingLeft: 14 }}>{label}</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14, fontWeight: 700, width: 14, textAlign: 'right' }}>
          {canContinue ? '→' : ''}
        </span>
      </button>
    );
  };

  // Bottom bar: dots + CTA
  const BottomBar = ({ page, count = 3, label, canContinue = true, onDark = false }) => (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '14px 22px 32px', boxSizing: 'border-box',
      background: onDark ? 'transparent' : `linear-gradient(180deg, rgba(247,244,234,0) 0%, ${paper} 36%)`,
      display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'stretch' }}>
      <PageDots active={page} count={count}/>
      <CTAButton label={label} canContinue={canContinue} onDark={onDark}/>
    </div>
  );

  // Top "Skip" + step counter, sits under the iOS status bar
  const TopBar = ({ page, count = 3, onDark = false }) => (
    <div style={{ position: 'relative', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '54px 22px 0' }}>
      <Mono size={10} color={onDark ? 'rgba(251,246,230,0.55)' : muted} ls="0.2em">
        STEP {String(page).padStart(2, '0')} / 0{count}
      </Mono>
      <Mono size={11} color={onDark ? citron : forest} ls="0.04em" weight={700}>
        Skip ↗
      </Mono>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────
  // SCREEN 01 · WELCOME / HOW IT WORKS
  // Cream bg, brand mark hero, 4 numbered step rows
  // ─────────────────────────────────────────────────────────────────
  const STEPS = [
    {
      n: '01',
      icon: 'bolt',
      t: 'Set up your game plan.',
      d: 'Pick what to track — speed, strength, cardio. Tune it any time.',
    },
    {
      n: '02',
      icon: 'flag',
      t: 'Take on a challenge.',
      d: 'Monthly goals push you to build the habit, not just the workout.',
    },
    {
      n: '03',
      icon: 'bars',
      t: 'Track progress.',
      d: 'Streaks, charts, training history. The round of your life.',
    },
    {
      n: '04',
      icon: 'check',
      t: 'Stay on track.',
      d: 'Gentle reminders, never push notifications about steaks.',
    },
  ];

  // tiny icon swatches (use I.* if available, fall back to small SVGs)
  const StepIcon = ({ kind, color = forest, size = 16 }) => {
    if (window.I && window.I[kind]) return window.I[kind]({ width: size, height: size });
    return <span style={{ width: size, height: size, background: color, borderRadius: 4 }}/>;
  };

  function OnbWelcome() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif' }}>

        <TopoLines color="#cfd9c8" opacity={0.5} h={844}/>

        <TopBar page={1}/>

        {/* hero */}
        <div style={{ position: 'relative', padding: '22px 22px 4px',
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BrandMark size={44}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Mono size={9.5} color={muted} ls="0.3em">SUBPAR · v3</Mono>
              <Mono size={9.5} color={forest} ls="0.18em" weight={700}>WELCOME</Mono>
            </div>
          </div>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.045em',
            lineHeight: 0.94, color: greenDeep, marginTop: 4 }}>
            How Subpar<br/>works<span style={{ color: citron }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: sub, fontWeight: 500, marginTop: 2,
            maxWidth: 300 }}>
            Four things you do. The app does the rest.
          </div>
        </div>

        {/* step cards */}
        <div style={{ position: 'relative', padding: '20px 18px 0',
          display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 16px', background: '#fff',
              border: `1px solid ${rule}`, borderRadius: 18 }}>
              {/* numbered icon tile */}
              <div style={{ width: 44, height: 44, borderRadius: 14, background: sage,
                display: 'grid', placeItems: 'center', color: forest,
                position: 'relative', flexShrink: 0 }}>
                <StepIcon kind={s.icon} size={18}/>
                <div style={{ position: 'absolute', top: -6, right: -6,
                  background: forest, color: citron, borderRadius: 99,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9, fontWeight: 800, padding: '2px 5px',
                  letterSpacing: '0.04em' }}>
                  {s.n}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: greenDeep,
                  letterSpacing: '-0.018em', lineHeight: 1.15 }}>
                  {s.t}
                </div>
                <div style={{ marginTop: 4, fontSize: 12.5, color: sub,
                  fontWeight: 500, lineHeight: 1.4 }}>
                  {s.d}
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomBar page={1} label="Continue"/>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // SCREEN 02 · BUILD YOUR PLAN
  // ─────────────────────────────────────────────────────────────────
  const PLAN_SECTIONS = [
    { id: 'golf', title: 'Golf', items: [
      { id: 'speed', name: 'Speed Training', meta: '1 session · binary',
        tile: { bg: sage, fg: forest, icon: 'bolt' } },
      { id: 'driver', name: 'Driver', meta: '1 session · binary',
        tile: { bg: g9, fg: forest, icon: 'flag' } },
      { id: 'putt', name: 'Putting', meta: '2 sessions · accuracy',
        tile: { bg: g9, fg: forest, icon: 'tee' } },
    ]},
    { id: 'workouts', title: 'Workouts', items: [
      { id: 'strength', name: 'Strength Training', meta: '1 session · binary',
        tile: { bg: '#f1d9cc', fg: clay, icon: 'dumbbell' } },
      { id: 'cardio', name: 'Cardio', meta: '1 session · binary',
        tile: { bg: '#f3eccd', fg: '#a37a1f', icon: 'trend' } },
      { id: 'core', name: 'Core', meta: '1 session · binary',
        tile: { bg: '#dbe6f0', fg: '#3a6688', icon: 'spark' } },
    ]},
    { id: 'lifestyle', title: 'Lifestyle', items: [
      { id: 'meals', name: 'Meals', meta: '3× daily · log',
        tile: { bg: '#e7d8f0', fg: '#6b4288', icon: 'check' } },
      { id: 'sleep', name: 'Sleep', meta: 'Nightly · 7h target',
        tile: { bg: '#dbe6f0', fg: '#3a6688', icon: 'spark' } },
    ]},
  ];

  const Radio = ({ checked }) => (
    <div style={{ width: 24, height: 24, borderRadius: 99,
      background: checked ? forest : '#fff',
      border: `1.5px solid ${checked ? forest : '#cfc9b5'}`,
      display: 'grid', placeItems: 'center', flexShrink: 0,
      boxShadow: checked ? '0 0 0 4px rgba(29,78,52,0.10)' : 'none',
      transition: 'all .15s' }}>
      {checked && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="m5 12 5 5L20 7" stroke={citron} strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );

  const PlanRow = ({ item, selected }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      background: selected ? cream : '#fff',
      border: `1.5px solid ${selected ? forest : rule}`,
      borderRadius: 16,
      boxShadow: selected ? '0 8px 18px rgba(29,78,52,0.10)' : 'none',
      transition: 'all .15s' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12,
        background: item.tile.bg, color: item.tile.fg,
        display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <StepIcon kind={item.tile.icon} color={item.tile.fg} size={17}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: greenDeep,
          letterSpacing: '-0.015em', lineHeight: 1.1 }}>
          {item.name}
        </div>
        <div style={{ marginTop: 2, fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10.5, color: muted, fontWeight: 600,
          letterSpacing: '0.02em' }}>
          {item.meta}
        </div>
      </div>
      <Radio checked={selected}/>
    </div>
  );

  function OnbPlan({ selectedIds = [] }) {
    const sel = new Set(selectedIds);
    const anySelected = selectedIds.length > 0;
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif' }}>

        <TopBar page={2}/>

        {/* heading */}
        <div style={{ position: 'relative', padding: '14px 22px 0' }}>
          <Mono size={9.5} color={forest} ls="0.22em">YOUR PROGRAM</Mono>
          <div style={{ marginTop: 6, fontSize: 38, fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: greenDeep }}>
            Build your<br/>game plan<span style={{ color: citron }}>.</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 13.5, color: sub, fontWeight: 500,
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span>You can change these in Settings.</span>
            <Mono size={11} color={forest} ls="0.04em" weight={700}>
              {sel.size === allIds().length ? 'Clear all' : 'Select all'} ↗
            </Mono>
          </div>
        </div>

        {/* scroll area with sections */}
        <div style={{ position: 'relative', padding: '18px 18px 200px',
          display: 'flex', flexDirection: 'column', gap: 18,
          height: 'calc(100% - 0px)', boxSizing: 'border-box',
          overflow: 'hidden' }}>
          {PLAN_SECTIONS.map(section => (
            <div key={section.id}>
              <div style={{ display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', padding: '0 4px 8px' }}>
                <Eyebrow color={muted}>{section.title}</Eyebrow>
                <Mono size={9.5} color={muted} op={0.7} ls="0.04em" weight={600}>
                  {section.items.filter(i => sel.has(i.id)).length}/{section.items.length}
                </Mono>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map(it => (
                  <PlanRow key={it.id} item={it} selected={sel.has(it.id)}/>
                ))}
              </div>
            </div>
          ))}
        </div>

        <BottomBar page={2} label="Next" canContinue={anySelected}/>
      </div>
    );
  }

  function allIds() {
    const ids = [];
    PLAN_SECTIONS.forEach(s => s.items.forEach(i => ids.push(i.id)));
    return ids;
  }

  // ─────────────────────────────────────────────────────────────────
  // SCREEN 03 · TAKE A CHALLENGE
  // Two large challenge cards · Get Long (forest+citron) · Get Strong (clay)
  // ─────────────────────────────────────────────────────────────────
  const CHALLENGES = [
    {
      id: 'getlong',
      title: 'Get Long.',
      sub: 'Build swing speed',
      meta: '12 speed-training sessions · 30 days',
      mph: '+4 MPH',
      target: 'driver',
      bg: forest,
      bgDeep: greenDeep,
      accent: citron,
      fg: cream,
      icon: 'bolt',
      tag: 'POPULAR',
    },
    {
      id: 'getstrong',
      title: 'Get Strong.',
      sub: 'Resistance + injury prevention',
      meta: '12 gym sessions · 30 days',
      mph: '+8 LB',
      target: 'rotational',
      bg: '#3a221a',
      bgDeep: '#22120c',
      accent: '#ff8d52',
      fg: cream,
      icon: 'dumbbell',
      tag: 'NEW',
    },
  ];

  const ChallengeCard = ({ c, selected, dim }) => (
    <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden',
      background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bgDeep} 100%)`,
      color: c.fg, padding: '18px 18px 20px',
      boxShadow: selected
        ? `0 16px 32px rgba(17,55,31,0.30), 0 0 0 2.5px ${c.accent}`
        : '0 10px 22px rgba(17,55,31,0.18)',
      opacity: dim ? 0.62 : 1,
      filter: dim ? 'saturate(0.7)' : 'none',
      transition: 'all .18s' }}>

      {/* topo lines */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 350 200" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke={c.accent} strokeWidth="0.8">
          <path d="M-20 30 C 80 5, 200 80, 380 25"/>
          <path d="M-20 80 C 80 55, 200 130, 380 75"/>
          <path d="M-20 130 C 80 105, 200 200, 380 125"/>
          <path d="M-20 180 C 80 155, 200 250, 380 175"/>
        </g>
      </svg>

      {/* top row: tag + radio */}
      <div style={{ position: 'relative', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: c.accent, color: c.bgDeep,
          padding: '4px 10px', borderRadius: 99,
          fontSize: 10, fontWeight: 800,
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: '0.14em' }}>
          <StepIcon kind={c.icon} color={c.bgDeep} size={11}/>
          {c.tag}
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 99,
          background: selected ? c.accent : 'rgba(255,255,255,0.08)',
          border: `1.5px solid ${selected ? c.accent : 'rgba(251,246,230,0.35)'}`,
          display: 'grid', placeItems: 'center',
          boxShadow: selected ? `0 0 0 5px ${c.accent}26` : 'none',
          transition: 'all .15s' }}>
          {selected && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="m5 12 5 5L20 7" stroke={c.bgDeep} strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* title block */}
      <div style={{ position: 'relative', marginTop: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em',
          lineHeight: 0.96, color: c.fg }}>
          {c.title.replace('.', '')}<span style={{ color: c.accent }}>.</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 13, fontWeight: 500,
          color: 'rgba(251,246,230,0.78)' }}>
          {c.sub}
        </div>
      </div>

      {/* metric strip */}
      <div style={{ position: 'relative', marginTop: 16, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, padding: '8px 12px',
          background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <div style={{ fontSize: 9.5, opacity: 0.7, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: '"JetBrains Mono", monospace' }}>
            Goal
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: c.accent,
            marginTop: 2, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums' }}>
            {c.mph}
          </div>
        </div>
        <div style={{ flex: 1.4, padding: '8px 12px',
          background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <div style={{ fontSize: 9.5, opacity: 0.7, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: '"JetBrains Mono", monospace' }}>
            Sessions
          </div>
          <div style={{ fontSize: 13, fontWeight: 700,
            marginTop: 3, lineHeight: 1, color: c.fg }}>
            {c.meta}
          </div>
        </div>
      </div>

      {/* segmented preview */}
      <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 3,
            background: 'rgba(255,255,255,0.18)' }}/>
        ))}
      </div>
    </div>
  );

  function OnbChallenge({ selectedId = null }) {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif' }}>

        <TopBar page={3}/>

        {/* heading */}
        <div style={{ position: 'relative', padding: '14px 22px 0' }}>
          <Mono size={9.5} color={forest} ls="0.22em">MONTH ONE · DAY ZERO</Mono>
          <div style={{ marginTop: 6, fontSize: 38, fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: greenDeep }}>
            Take a<br/>challenge<span style={{ color: citron }}>.</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 13.5, color: sub, fontWeight: 500 }}>
            Pick one to kick off your first month. Swap any time.
          </div>
        </div>

        {/* challenge cards */}
        <div style={{ position: 'relative', padding: '18px 18px 0',
          display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CHALLENGES.map(c => (
            <ChallengeCard key={c.id} c={c}
              selected={selectedId === c.id}
              dim={selectedId !== null && selectedId !== c.id}/>
          ))}
        </div>

        {/* tertiary link to view all */}
        <div style={{ position: 'relative', padding: '14px 22px 0',
          display: 'flex', justifyContent: 'center' }}>
          <Mono size={11} color={forest} ls="0.04em" weight={700}>
            See all 6 challenges ↗
          </Mono>
        </div>

        <BottomBar page={3} label="Start training"
          canContinue={selectedId !== null}/>
      </div>
    );
  }

  Object.assign(window, {
    OnbWelcome, OnbPlan, OnbChallenge,
  });
})();
