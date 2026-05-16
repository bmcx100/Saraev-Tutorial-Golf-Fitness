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

import { stickColors } from '@/constants/design-tokens';

export const STICK_COLORS: { key: StickColor; label: string; color: string }[] = [
  { key: 'green', label: 'Green', color: stickColors.green },
  { key: 'blue', label: 'Blue', color: stickColors.blue },
  { key: 'red', label: 'Red', color: stickColors.red },
];

export const DRILL_STEPS: { key: DrillType; label: string; instruction: string }[] = [
  { key: 'normalStance', label: 'Normal Stance', instruction: 'Swing each 3\u00D7, log your best' },
  { key: 'stepDrill', label: 'Step Drill', instruction: 'Swing each 3\u00D7, log your best' },
  { key: 'maxOut', label: 'Max Out', instruction: 'Swing 3\u00D7, log your best' },
];

export const DRIVER_MILESTONES: number[] = [90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140];

export const SPEED_FIELD_KEYS: { key: string; label: string }[] = [
  { key: 'normalStance.green.dom', label: 'Green Normal Dom' },
  { key: 'normalStance.green.nonDom', label: 'Green Normal Non-Dom' },
  { key: 'normalStance.blue.dom', label: 'Blue Normal Dom' },
  { key: 'normalStance.blue.nonDom', label: 'Blue Normal Non-Dom' },
  { key: 'normalStance.red.dom', label: 'Red Normal Dom' },
  { key: 'normalStance.red.nonDom', label: 'Red Normal Non-Dom' },
  { key: 'stepDrill.green.dom', label: 'Green Step Drill Dom' },
  { key: 'stepDrill.green.nonDom', label: 'Green Step Drill Non-Dom' },
  { key: 'stepDrill.blue.dom', label: 'Blue Step Drill Dom' },
  { key: 'stepDrill.blue.nonDom', label: 'Blue Step Drill Non-Dom' },
  { key: 'stepDrill.red.dom', label: 'Red Step Drill Dom' },
  { key: 'stepDrill.red.nonDom', label: 'Red Step Drill Non-Dom' },
  { key: 'maxOut.green', label: 'Green Stick Max Out' },
  { key: 'maxOut.driver', label: 'Driver Max Out' },
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
