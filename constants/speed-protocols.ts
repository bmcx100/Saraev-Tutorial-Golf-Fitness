export type StickColor = 'green' | 'blue' | 'red';
export type DrillType = 'normalStance' | 'stepDrill' | 'maxOut';

export interface StickSpeeds {
  dom: number | null;
  nonDom: number | null;
}

export interface MaxOutSpeeds {
  green: number | null;
  driver: number | null;
}

export interface SpeedSession {
  date: string; // YYYY-MM-DD
  protocol: string;
  normalStance: Record<StickColor, StickSpeeds>;
  stepDrill: Record<StickColor, StickSpeeds>;
  maxOut: MaxOutSpeeds;
  completedAt: string; // ISO timestamp
}

export const STICK_COLORS: { key: StickColor; label: string; color: string }[] = [
  { key: 'green', label: 'Green', color: '#22C55E' },
  { key: 'blue', label: 'Blue', color: '#3B82F6' },
  { key: 'red', label: 'Red', color: '#EF4444' },
];

export const DRILL_STEPS: { key: DrillType; label: string; instruction: string }[] = [
  { key: 'normalStance', label: 'Normal Stance', instruction: 'Swing each 3\u00D7, log your best' },
  { key: 'stepDrill', label: 'Step Drill', instruction: 'Swing each 3\u00D7, log your best' },
  { key: 'maxOut', label: 'Max Out', instruction: 'Swing 3\u00D7, log your best' },
];

export function emptySession(date: string, protocol: string): SpeedSession {
  return {
    date,
    protocol,
    normalStance: {
      green: { dom: null, nonDom: null },
      blue: { dom: null, nonDom: null },
      red: { dom: null, nonDom: null },
    },
    stepDrill: {
      green: { dom: null, nonDom: null },
      blue: { dom: null, nonDom: null },
      red: { dom: null, nonDom: null },
    },
    maxOut: { green: null, driver: null },
    completedAt: '',
  };
}
