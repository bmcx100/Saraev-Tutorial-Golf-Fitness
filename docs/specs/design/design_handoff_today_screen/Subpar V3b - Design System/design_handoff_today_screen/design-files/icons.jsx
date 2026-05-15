// Shared inline SVG icon set — small, line-based, no external assets.
// Stroke uses currentColor so each style can theme them.

const I = {
  gear: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
  bolt: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>
    </svg>
  ),
  flag: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 22V4"/><path d="M4 4h11l-2 4 2 4H4"/>
    </svg>
  ),
  flagFill: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 22a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v17a1 1 0 0 1-1 1z"/>
      <path d="M5 4h11l-2 4 2 4H5z"/>
    </svg>
  ),
  check: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12 5 5L20 7"/>
    </svg>
  ),
  checkCircle: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m7 12 3.5 3.5L17 9" fill="none" stroke="#fff" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bars: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 20V10M12 20V4M19 20v-7"/>
    </svg>
  ),
  // golf tee w/ ball, simple geometric
  tee: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="6" r="3"/>
      <path d="M9 11h6l-2 11h-2z"/>
    </svg>
  ),
  // dumbbell
  dumbbell: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>
    </svg>
  ),
  // sparkle / lifestyle
  spark: (p={}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>
    </svg>
  ),
  arrow: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  trend: (p={}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 17l6-6 4 4 8-9"/><path d="M14 6h7v7"/>
    </svg>
  ),
};

window.I = I;
