// Subpar · Strength Training · "Smart next-set" card
// Variant C from the v2 exploration — chosen direction.
//
// Behaviour:
//   - Each exercise is a single compact card.
//   - Tap "Log Set N" → log a set at the current target weight × reps.
//   - The card you're working on glows hard (citron border, halo, lift)
//     and shows a floating "NOW · SET N" badge.
//   - Weight and reps pills are tappable to edit — handled by a sheet
//     (out of scope here; this prototype does not implement the sheet).
//   - Done cards collapse to a "3 of 3 done" pill and dim slightly.
//
// All measurements, colors, copy, and component breakdowns are documented
// in the accompanying README.md.

(function () {
  // ─── Tokens (from Subpar v3b design system) ──────────────────────
  const ink        = '#0e2118';
  const sub        = '#5d6e64';
  const forest     = '#1d4e34';
  const greenDeep  = '#11371f';
  const g7         = '#6db483';
  const citron     = '#cfde50';
  const cream      = '#fbf6e6';
  const paper      = '#f7f4ea';
  const rule       = '#e2dcc0';

  // ─── Icons ───────────────────────────────────────────────────────
  const CheckIcon = ({ s = 14, color = greenDeep, w = 3 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7"/>
    </svg>
  );
  const BackIcon = ({ s = 16, color = cream }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  // ─── Hero (forest gradient · 4-tab strip · SETS DONE readout) ────
  const TabSeg4 = ({ active = 0 }) => {
    const tabs = ['Legs 1', 'Pull', 'Legs 2', 'Push'];
    return (
      <div style={{ display: 'flex', gap: 5, padding: 4,
        background: 'rgba(251,246,230,0.10)',
        border: '1px solid rgba(251,246,230,0.16)',
        borderRadius: 14 }}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <div key={t} style={{ flex: 1,
              background: on ? citron : 'transparent', borderRadius: 10,
              padding: '7px 4px', textAlign: 'center',
              fontFamily: '"Outfit", system-ui, sans-serif',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              color: on ? greenDeep : 'rgba(251,246,230,0.7)',
              boxShadow: on ? '0 6px 12px rgba(207,222,80,0.25), inset 0 1px 0 rgba(255,255,255,0.35)' : 'none' }}>
              {t}
            </div>
          );
        })}
      </div>
    );
  };

  const StrengthHero = ({ progress = '4 / 12', muscle = 'Quads' }) => (
    <div style={{ position: 'relative',
      background: `linear-gradient(160deg, ${forest} 0%, ${greenDeep} 100%)`,
      color: cream, padding: '50px 18px 12px',
      borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.28, pointerEvents: 'none' }}
           width="100%" height="100%" viewBox="0 0 390 200"
           preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke={g7} strokeWidth="0.9">
          <path d="M-50 40 C 80 10, 220 110, 460 30"/>
          <path d="M-50 90 C 80 60, 220 160, 460 80"/>
          <path d="M-50 140 C 100 110, 240 200, 460 140"/>
          <path d="M-50 190 C 120 160, 260 250, 460 200"/>
        </g>
      </svg>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, flex: '0 0 32px',
          display: 'grid', placeItems: 'center',
          background: 'rgba(251,246,230,0.10)', color: cream,
          border: '1px solid rgba(251,246,230,0.20)' }}>
          <BackIcon s={16} color={cream}/>
        </div>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.24em',
          color: 'rgba(251,246,230,0.6)', whiteSpace: 'nowrap' }}>
          WK 3 · DAY 2
        </span>
      </div>
      <div style={{ position: 'relative', marginTop: 10,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: citron,
            fontFamily: '"JetBrains Mono", monospace' }}>Build Strong</div>
          <div style={{ marginTop: 3, fontSize: 26, fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 0.95, color: cream,
            whiteSpace: 'nowrap' }}>Strength Training.</div>
          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(207,222,80,0.18)', color: citron,
            border: '1px solid rgba(207,222,80,0.4)',
            padding: '2px 8px', borderRadius: 99,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em' }}>
            {muscle.toUpperCase()} · 4 EXERCISES
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: '0 0 auto', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 22, fontWeight: 700, color: citron, letterSpacing: '-0.01em',
            textShadow: '0 0 14px rgba(207,222,80,0.4)' }}>{progress}</div>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.2em',
            color: 'rgba(251,246,230,0.6)', whiteSpace: 'nowrap' }}>
            SETS DONE
          </span>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 12 }}>
        <TabSeg4 active={0}/>
      </div>
    </div>
  );

  // ─── 3-dot progress indicator ────────────────────────────────────
  const DotProgress = ({ done = 0, total = 3, tone = 'idle' }) => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: i < done ? 14 : 7, height: 7, borderRadius: 99,
          background: i < done
            ? citron
            : (tone === 'next' && i === done ? forest : 'rgba(14,33,24,0.15)'),
          boxShadow: i < done ? '0 0 6px rgba(207,222,80,0.5)' : 'none' }}/>
      ))}
    </div>
  );

  // ─── Tappable value pill (weight / reps) ─────────────────────────
  const ValuePill = ({ value, unit, label, tone = 'idle' }) => {
    const styles = {
      idle: { bg: 'transparent', border: `1.5px dashed ${rule}`, valueColor: 'rgba(14,33,24,0.55)' },
      next: { bg: '#fff', border: `1.5px solid ${forest}`, valueColor: greenDeep,
        shadow: '0 4px 10px rgba(17,55,31,0.10), inset 0 1px 0 rgba(255,255,255,0.6)' },
      done: { bg: paper, border: `1px solid ${rule}`, valueColor: greenDeep },
    }[tone];
    return (
      <div style={{
        background: styles.bg, border: styles.border,
        borderRadius: 12, padding: '7px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        minWidth: 64, cursor: 'pointer',
        boxShadow: styles.shadow || 'none' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
          fontSize: 9, fontWeight: 700, color: sub, letterSpacing: '0.18em' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 19, fontWeight: 700, color: styles.valueColor,
            letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9.5, fontWeight: 600, color: sub, letterSpacing: '0.04em' }}>
            {unit}
          </span>
        </div>
      </div>
    );
  };

  // ─── Primary CTA per card ────────────────────────────────────────
  const LogSetButton = ({ label, tone = 'next' }) => {
    const styles = {
      next: {
        background: citron, color: greenDeep, border: 'none',
        shadow: '0 10px 22px rgba(207,222,80,0.45), inset 0 1px 0 rgba(255,255,255,0.45)',
        fontSize: 15, padding: '13px 14px',
      },
      idle: {
        background: '#fff', color: forest, border: `1.5px solid ${rule}`,
        shadow: 'none', fontSize: 13, padding: '10px 14px',
      },
      done: {
        background: 'rgba(207,222,80,0.20)', color: greenDeep,
        border: `1px solid ${citron}`,
        shadow: 'none', fontSize: 13, padding: '10px 14px',
      },
    }[tone];
    return (
      <div style={{ flex: 1,
        background: styles.background, color: styles.color,
        border: styles.border, borderRadius: 14, padding: styles.padding,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontSize: styles.fontSize, fontWeight: 800, letterSpacing: '-0.01em',
        cursor: 'pointer', boxShadow: styles.shadow }}>
        {tone === 'done' && <CheckIcon s={14} w={3} color={greenDeep}/>}
        {label}
        {tone === 'next' && (
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14, fontWeight: 800, marginLeft: 2 }}>→</span>
        )}
      </div>
    );
  };

  // ─── Exercise card · idle / next (active) / done states ──────────
  const ExerciseCard = ({ name, weight, reps, done, total = 3, tone, label }) => {
    const isActive = tone === 'next';
    const pillTone = isActive ? 'next' : (tone === 'done' ? 'done' : 'idle');
    return (
      <div style={{ position: 'relative',
        background: isActive ? 'linear-gradient(180deg, #ffffff 0%, #fbfaf2 100%)' : '#fff',
        border: isActive ? `2px solid ${citron}` : `1px solid ${rule}`,
        borderRadius: 18, padding: isActive ? '14px 14px' : '12px 14px',
        boxShadow: isActive
          ? `0 0 0 4px rgba(207,222,80,0.20), 0 18px 30px rgba(17,55,31,0.18), 0 4px 10px rgba(17,55,31,0.10)`
          : (tone === 'done' ? 'none' : '0 1px 0 rgba(17,55,31,0.04)'),
        opacity: tone === 'done' ? 0.78 : 1,
        display: 'flex', flexDirection: 'column', gap: 10,
        transform: isActive ? 'translateY(-1px)' : 'none' }}>

        {isActive && (
          <div style={{ position: 'absolute', top: -10, left: 14,
            background: citron, color: greenDeep,
            padding: '3px 9px', borderRadius: 99,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, fontWeight: 800, letterSpacing: '0.20em',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 10px rgba(207,222,80,0.5)' }}>
            NOW · SET {done + 1}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isActive ? 17 : 15.5, fontWeight: 800, color: ink,
              letterSpacing: '-0.018em', lineHeight: 1.1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </div>
            {isActive && (
              <div style={{ marginTop: 3, fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10, fontWeight: 700, color: forest,
                letterSpacing: '0.16em' }}>
                TAP A VALUE TO ADJUST
              </div>
            )}
          </div>
          <DotProgress done={done} total={total} tone={tone}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
          <ValuePill value={weight} unit="lb" label="WEIGHT" tone={pillTone}/>
          <ValuePill value={reps} unit="reps" label="REPS" tone={pillTone}/>
          <LogSetButton tone={tone} label={label}/>
        </div>
      </div>
    );
  };

  // ─── Bottom submit CTA ───────────────────────────────────────────
  const SubmitCTA = ({ progress = '4 / 12' }) => {
    const done = progress.startsWith('12');
    return (
      <div style={{ padding: '12px 18px 22px',
        borderTop: `1px solid ${rule}`, background: '#fff' }}>
        <button style={{ width: '100%',
          background: done ? citron : 'rgba(207,222,80,0.35)',
          color: done ? greenDeep : 'rgba(17,55,31,0.5)',
          border: 'none', borderRadius: 16, padding: '14px 18px',
          fontFamily: '"Outfit", system-ui, sans-serif',
          fontSize: 15, fontWeight: 800, letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, cursor: 'pointer',
          boxShadow: done ? '0 10px 22px rgba(207,222,80,0.32), inset 0 1px 0 rgba(255,255,255,0.4)' : 'none' }}>
          <span>Submit Workout</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            {progress} SETS
          </span>
        </button>
      </div>
    );
  };

  // ─── The screen ──────────────────────────────────────────────────
  function StrengthTrainingScreen() {
    return (
      <div style={{ width: '100%', height: '100%', background: paper, color: ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: '"Outfit", system-ui, sans-serif',
        display: 'flex', flexDirection: 'column' }}>
        <StrengthHero progress="4 / 12"/>

        <div style={{ padding: '14px 14px 14px', flex: 1,
          display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <ExerciseCard name="Calf Raises"   weight={50} reps={8}
            done={3} tone="done" label="3 of 3 done"/>
          <ExerciseCard name="Tib Raises"    weight={50} reps={8}
            done={1} tone="next" label="Log Set 2"/>
          <ExerciseCard name="Split Squats"  weight={50} reps={8}
            done={0} tone="idle" label="Log Set 1"/>
          <ExerciseCard name="Squats"        weight={50} reps={8}
            done={0} tone="idle" label="Log Set 1"/>
        </div>

        <SubmitCTA progress="4 / 12"/>
      </div>
    );
  }

  Object.assign(window, { StrengthTrainingScreen });
})();
