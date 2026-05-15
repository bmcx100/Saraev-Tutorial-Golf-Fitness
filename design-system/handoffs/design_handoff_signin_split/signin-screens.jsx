// Subpar · Golf Fitness · Sign-in screen
// Three directions, all using the v3b design system:
//   A · Forest hero — full forest bg, topo lines, cream type, citron CTA
//   B · Sage moon — G8 surface with one big G9 circle (matches G8 card family)
//   C · Split — forest brand band on top, paper form below (most app-like)

(function () {
  const ink = '#0e2118';
  const forest = '#1d4e34';
  const greenDeep = '#11371f';
  const g7 = '#6db483';
  const g8 = '#92cba2';
  const g9 = '#bcdfc6';
  const citron = '#cfde50';
  const cream = '#fbf6e6';
  const paper = '#f7f4ea';
  const rule  = '#e2dcc0';
  const clay  = '#cc6f4a';

  const Mono = ({ children, size = 11, color, op = 1, weight = 700, ls = '0.04em' }) => (
    <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: size, color, opacity: op, fontWeight: weight, letterSpacing: ls }}>{children}</span>
  );

  // ─── Brand mark: concentric ring with citron flag dot ────────────
  // Replaces the generic golf-ball-on-tee circle in the screenshot.
  const BrandMark = ({ size = 72, onDark = false }) => {
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
        {/* flag */}
        <path d={`M ${c - 0.5} ${c - r3 + 2} L ${c - 0.5} ${c + r3 - 4}`}
              stroke={greenDeep} strokeWidth="1.6" strokeLinecap="round"/>
        <path d={`M ${c} ${c - r3 + 3} L ${c + r3 - 4} ${c - r3 + 7} L ${c} ${c - r3 + 11} Z`}
              fill={greenDeep}/>
        {/* arc dash · life */}
        <circle cx={c} cy={c} r={r1} fill="none" stroke={stroke} strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * r1 * 0.32} ${2 * Math.PI * r1}`}
                strokeLinecap="round"
                transform={`rotate(-78 ${c} ${c})`}/>
      </svg>
    );
  };

  // ─── Topo lines svg (re-usable bg) ───────────────────────────────
  const TopoLines = ({ color = '#9eb59a', opacity = 0.4, w = 390, h = 380 }) => (
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

  // ─── Field (used by all three) ───────────────────────────────────
  const Field = ({ label, value, theme = 'paper', icon }) => {
    const onDark = theme === 'dark';
    const bg = onDark ? 'rgba(251,246,230,0.08)' : '#fff';
    const bd = onDark ? 'rgba(251,246,230,0.18)' : rule;
    const fg = onDark ? cream : ink;
    const ph = onDark ? 'rgba(251,246,230,0.5)' : '#9aa39c';
    return (
      <label style={{ display: 'block' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: onDark ? 'rgba(251,246,230,0.55)' : '#6b756f',
          marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10,
          background: bg, border: `1px solid ${bd}`, borderRadius: 14,
          padding: '12px 14px' }}>
          {icon && <span style={{ color: onDark ? 'rgba(251,246,230,0.55)' : '#9aa39c',
            display: 'inline-flex' }}>{icon}</span>}
          <span style={{ fontSize: 15, fontWeight: 500,
            color: value ? fg : ph,
            letterSpacing: '-0.005em' }}>
            {value || (label.toLowerCase() === 'password' ? '••••••••••' : 'you@golf.com')}
          </span>
        </div>
      </label>
    );
  };

  // tiny inline icons used in fields
  const MailIcon = ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="m3 7 9 6 9-6"/>
    </svg>
  );
  const LockIcon = ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
    </svg>
  );
  const GoogleG = ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.1 0-9.5-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C42 35 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );

  // ─────────────────────────────────────────────────────────────
  // A · FOREST HERO
  // Full forest background. Topo lines. Cream text. Single citron CTA.
  // Most premium / brand-forward feel.
  // ─────────────────────────────────────────────────────────────
  function SigninForest() {
    return (
      <div style={{ width: '100%', height: '100%',
        background: `linear-gradient(180deg, ${greenDeep} 0%, ${forest} 100%)`,
        color: cream, position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column',
        padding: '64px 24px 32px', boxSizing: 'border-box' }}>
        <TopoLines color={g7} opacity={0.28} h={844}/>

        {/* Brand */}
        <div style={{ position: 'relative', display: 'flex',
          flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          <BrandMark size={64} onDark/>
          <div style={{ marginTop: 18, fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.32em',
            color: 'rgba(251,246,230,0.6)' }}>
            SUBPAR · v3
          </div>
          <div style={{ marginTop: 8, fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: cream }}>
            Golf Fitness.
          </div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500,
            color: 'rgba(251,246,230,0.7)', letterSpacing: '-0.005em' }}>
            Train smarter · play better.
          </div>
        </div>

        {/* Form */}
        <div style={{ position: 'relative', marginTop: 38,
          display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: citron,
            fontFamily: '"JetBrains Mono", monospace' }}>
            Welcome back · Day 1
          </div>
          <Field label="Email" value="" theme="dark" icon={<MailIcon/>}/>
          <Field label="Password" value="••••••••••" theme="dark" icon={<LockIcon/>}/>

          <button style={{ marginTop: 6,
            background: citron, color: greenDeep, border: 'none',
            borderRadius: 16, padding: '16px 18px',
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 15, fontWeight: 800, letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: `0 10px 22px rgba(207,222,80,0.30), inset 0 1px 0 rgba(255,255,255,0.35)` }}>
            <span>Tee it up</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace',
              fontSize: 16, fontWeight: 700 }}>→</span>
          </button>

          {/* divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(251,246,230,0.18)' }}/>
            <Mono size={9.5} color="rgba(251,246,230,0.5)" ls="0.32em">OR</Mono>
            <div style={{ flex: 1, height: 1, background: 'rgba(251,246,230,0.18)' }}/>
          </div>

          <button style={{ background: 'rgba(251,246,230,0.06)',
            border: '1px solid rgba(251,246,230,0.22)',
            color: cream, borderRadius: 16, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <GoogleG s={16}/>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer links */}
        <div style={{ position: 'relative', marginTop: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 500,
            color: 'rgba(251,246,230,0.7)' }}>
            New here? <span style={{ color: citron, fontWeight: 700 }}>Create an account</span>
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, fontWeight: 600, letterSpacing: '0.2em',
            color: 'rgba(251,246,230,0.4)', textTransform: 'uppercase' }}>
            · Magic link instead ·
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // B · SAGE MOON
  // G8 surface · one big G9 disc bleeding off top-right (matches the
  // forest-card-g8 family). Dark forest text. Citron CTA.
  // Lightest / most "wellness-app" feel.
  // ─────────────────────────────────────────────────────────────
  function SigninSage() {
    return (
      <div style={{ width: '100%', height: '100%',
        background: g8, color: forest, position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column',
        padding: '60px 24px 28px', boxSizing: 'border-box' }}>

        {/* One big G9 disc */}
        <div style={{ position: 'absolute', right: -120, top: -120,
          width: 360, height: 360, borderRadius: '50%',
          background: g9 }}/>
        {/* small secondary disc bottom-left for rhythm */}
        <div style={{ position: 'absolute', left: -60, bottom: -100,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(188,223,198,0.55)' }}/>

        {/* Brand */}
        <div style={{ position: 'relative', display: 'flex',
          flexDirection: 'column', alignItems: 'flex-start', marginTop: 30 }}>
          <BrandMark size={56}/>
          <div style={{ marginTop: 22, fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.32em',
            color: 'rgba(14,33,24,0.55)' }}>
            SUBPAR · v3
          </div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 800,
            letterSpacing: '-0.045em', lineHeight: 0.9, color: greenDeep }}>
            Golf<br/>Fitness.
          </div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600,
            color: 'rgba(14,33,24,0.65)' }}>
            Train smarter · play better.
          </div>
        </div>

        {/* Form card sits flush on the sage */}
        <div style={{ position: 'relative', marginTop: 28,
          background: cream, borderRadius: 24, padding: '22px 20px',
          boxShadow: '0 18px 36px rgba(17,55,31,0.16), inset 0 1px 0 rgba(255,255,255,0.6)',
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between' }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
              color: greenDeep }}>Welcome back.</div>
            <Mono size={10} color="#6b756f" ls="0.18em">RETURNING</Mono>
          </div>
          <Field label="Email" value="" icon={<MailIcon/>}/>
          <Field label="Password" value="••••••••••" icon={<LockIcon/>}/>

          <button style={{ marginTop: 4,
            background: forest, color: citron, border: 'none',
            borderRadius: 14, padding: '14px 18px',
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 10px 22px rgba(17,55,31,0.30)' }}>
            <span>Sign in</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14, fontWeight: 700 }}>→</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <div style={{ flex: 1, height: 1, background: rule }}/>
            <Mono size={9.5} color="#9aa39c" ls="0.32em">OR</Mono>
            <div style={{ flex: 1, height: 1, background: rule }}/>
          </div>

          <button style={{ background: '#fff', border: `1px solid ${rule}`,
            color: ink, borderRadius: 14, padding: '12px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
            <GoogleG s={15}/>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', marginTop: 'auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 4px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: greenDeep }}>
            New? <span style={{ textDecoration: 'underline', textDecorationColor: clay }}>Sign up</span>
          </div>
          <Mono size={10} color={greenDeep} op={0.5} ls="0.2em">MAGIC LINK ↗</Mono>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // C · SPLIT
  // Forest band hero up top with concentric ring decoration · paper
  // form card overlapping into a clean lower section. Most "app-like"
  // and closest in structure to the original screenshot.
  // ─────────────────────────────────────────────────────────────
  function SigninSplit() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column' }}>

        {/* Forest band hero */}
        <div style={{ position: 'relative', height: 360,
          background: `linear-gradient(160deg, ${forest} 0%, ${greenDeep} 100%)`,
          color: cream, overflow: 'hidden',
          padding: '64px 24px 0', boxSizing: 'border-box',
          borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
          <TopoLines color={g7} opacity={0.32} w={390} h={360}/>

          {/* big concentric ring decoration (matches today-screen motif) */}
          <svg style={{ position: 'absolute', right: -80, top: -40,
            opacity: 0.85, pointerEvents: 'none' }}
            width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="120" fill="none"
              stroke="rgba(207,222,80,0.32)" strokeWidth="2"/>
            <circle cx="140" cy="140" r="92" fill="none"
              stroke="rgba(251,246,230,0.18)" strokeWidth="2"/>
            <circle cx="140" cy="140" r="64" fill="none"
              stroke="rgba(251,246,230,0.12)" strokeWidth="2"/>
            <circle cx="140" cy="140" r="120" fill="none"
              stroke={citron} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 120 * 0.18} ${2 * Math.PI * 120}`}
              strokeLinecap="round"
              transform="rotate(-90 140 140)"/>
          </svg>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <BrandMark size={42} onDark/>
              <Mono size={10} color="rgba(251,246,230,0.55)" ls="0.3em">SUBPAR · v3</Mono>
            </div>
            <div style={{ marginTop: 20, fontSize: 11, fontWeight: 800,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: citron, fontFamily: '"JetBrains Mono", monospace' }}>
              Welcome back
            </div>
            <div style={{ marginTop: 8, fontSize: 48, fontWeight: 800,
              letterSpacing: '-0.045em', lineHeight: 0.92, color: cream }}>
              Golf Fitness.
            </div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 500,
              color: 'rgba(251,246,230,0.72)' }}>
              Train smarter · play better.
            </div>
          </div>
        </div>

        {/* Form card · pulls up into the forest band */}
        <div style={{ position: 'relative', margin: '-50px 18px 0',
          background: '#fff', border: `1px solid ${rule}`, borderRadius: 24,
          padding: '22px 20px',
          boxShadow: '0 22px 40px rgba(17,55,31,0.18)',
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between' }}>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em',
              color: greenDeep }}>Sign in</div>
            <Mono size={10} color="#6b756f" ls="0.2em">DAY 1 · ACTIVE</Mono>
          </div>
          <Field label="Email" value="" icon={<MailIcon/>}/>
          <Field label="Password" value="••••••••••" icon={<LockIcon/>}/>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Mono size={11} color={forest} ls="0.04em" weight={700}>Forgot? ↗</Mono>
          </div>

          <button style={{ background: citron, color: greenDeep, border: 'none',
            borderRadius: 14, padding: '14px 18px',
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 15, fontWeight: 800, letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 10px 22px rgba(207,222,80,0.30), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
            <span>Tee it up</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14, fontWeight: 700 }}>→</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <div style={{ flex: 1, height: 1, background: rule }}/>
            <Mono size={9.5} color="#9aa39c" ls="0.32em">OR</Mono>
            <div style={{ flex: 1, height: 1, background: rule }}/>
          </div>

          <button style={{ background: '#fff', border: `1px solid ${rule}`,
            color: ink, borderRadius: 14, padding: '12px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
            <GoogleG s={15}/>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', marginTop: 'auto',
          padding: '20px 24px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: greenDeep }}>
            New here? <span style={{ color: clay, fontWeight: 700,
              textDecoration: 'underline', textDecorationColor: 'rgba(204,111,74,0.4)' }}>
              Create an account
            </span>
          </div>
          <Mono size={10} color={forest} op={0.5} ls="0.24em">USE MAGIC LINK ↗</Mono>
        </div>
      </div>
    );
  }

  Object.assign(window, {
    SigninForest, SigninSage, SigninSplit,
  });
})();
