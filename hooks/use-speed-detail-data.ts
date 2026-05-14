import { useState, useEffect, useMemo } from 'react';
import { formatDate, dateRange, loadSpeedSessionRange } from '@/utils/storage';
import type { SpeedSession, StickColor } from '@/constants/speed-protocols';
import { STICK_COLORS } from '@/constants/speed-protocols';

// ── Types ────────────────────────────────────────────────────

export interface DriverSpeedPoint {
  date: string;
  mph: number;
}

export interface StickPR {
  mph: number;
  date: string;
}

export interface GapEntry {
  color: StickColor;
  label: string;
  currentGap: number;
  previousGap: number;
  trend: 'closing' | 'widening' | 'stable';
}

export interface TransferRate {
  stickGain: number;
  driverGain: number;
  assessment: 'good' | 'lagging';
}

export interface WeekEntry {
  weekStart: string;
  count: number;
  hitMinimum: boolean;
}

export interface ProtocolSummary {
  name: string;
  totalSessions: number;
  firstDate: string;
  lastDate: string;
  driverGain: number;
}

// ── Helpers ──────────────────────────────────────────────────

function getMondayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // shift so Monday=0
  d.setDate(d.getDate() - diff);
  return formatDate(d);
}

type StickSide = 'dom' | 'nonDom';
type StickKey = `${StickColor}-${StickSide}`;

// ── Hook ─────────────────────────────────────────────────────

export function useSpeedDetailData() {
  const [sessions, setSessions] = useState<SpeedSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - 89); // 90 days including today
      const dates = dateRange(formatDate(start), 90);
      const data = await loadSpeedSessionRange(dates);

      if (cancelled) return;

      data.sort((a, b) => a.date.localeCompare(b.date));
      setSessions(data);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Driver speeds (non-null maxOut.driver entries)
  const driverSpeeds = useMemo<DriverSpeedPoint[]>(() => {
    return sessions
      .filter((s) => s.maxOut.driver != null)
      .map((s) => ({ date: s.date, mph: s.maxOut.driver! }));
  }, [sessions]);

  // Per-stick PRs: max across normalStance and stepDrill for each color+side
  const stickPRs = useMemo<Record<StickKey, StickPR | null>>(() => {
    const prs: Record<string, StickPR | null> = {};
    const sides: StickSide[] = ['dom', 'nonDom'];

    for (const sc of STICK_COLORS) {
      for (const side of sides) {
        const key: StickKey = `${sc.key}-${side}`;
        let best: StickPR | null = null;

        for (const session of sessions) {
          const ns = session.normalStance[sc.key][side];
          const sd = session.stepDrill[sc.key][side];
          const sessionMax = Math.max(ns ?? 0, sd ?? 0);
          if (sessionMax > 0 && (!best || sessionMax > best.mph)) {
            best = { mph: sessionMax, date: session.date };
          }
        }

        prs[key] = best;
      }
    }

    return prs as Record<StickKey, StickPR | null>;
  }, [sessions]);

  // Dom vs Non-Dom gap analysis using normalStance only
  const domNonDomGap = useMemo<GapEntry[]>(() => {
    if (sessions.length === 0) return [];

    const today = new Date();
    const midpoint = new Date(today);
    midpoint.setDate(midpoint.getDate() - 45);
    const midStr = formatDate(midpoint);

    const recent = sessions.filter((s) => s.date > midStr);
    const previous = sessions.filter((s) => s.date <= midStr);

    return STICK_COLORS.map((sc) => {
      function avgGap(group: SpeedSession[]): number {
        let totalGap = 0;
        let count = 0;
        for (const s of group) {
          const dom = s.normalStance[sc.key].dom;
          const nonDom = s.normalStance[sc.key].nonDom;
          if (dom != null && nonDom != null) {
            totalGap += dom - nonDom;
            count++;
          }
        }
        return count > 0 ? totalGap / count : 0;
      }

      const currentGap = avgGap(recent);
      const previousGap = avgGap(previous);
      let trend: 'closing' | 'widening' | 'stable' = 'stable';
      if (currentGap < previousGap - 1) trend = 'closing';
      else if (currentGap > previousGap + 1) trend = 'widening';

      return {
        color: sc.key,
        label: sc.label,
        currentGap: Math.round(currentGap * 10) / 10,
        previousGap: Math.round(previousGap * 10) / 10,
        trend,
      };
    });
  }, [sessions]);

  // Stick-to-driver transfer rate
  const transferRate = useMemo<TransferRate | null>(() => {
    if (sessions.length < 2) return null;

    const earliest = sessions[0];
    const latest = sessions[sessions.length - 1];

    // Average improvement across all 6 normalStance stick positions
    const sides: StickSide[] = ['dom', 'nonDom'];
    let totalStickGain = 0;
    let stickCount = 0;

    for (const sc of STICK_COLORS) {
      for (const side of sides) {
        const earlyVal = earliest.normalStance[sc.key][side];
        const lateVal = latest.normalStance[sc.key][side];
        if (earlyVal != null && lateVal != null) {
          totalStickGain += lateVal - earlyVal;
          stickCount++;
        }
      }
    }

    const stickGain = stickCount > 0 ? totalStickGain / stickCount : 0;

    const earlyDriver = earliest.maxOut.driver;
    const lateDriver = latest.maxOut.driver;
    const driverGain = (earlyDriver != null && lateDriver != null) ? lateDriver - earlyDriver : 0;

    const assessment: 'good' | 'lagging' =
      stickGain <= 0 || driverGain >= 0.7 * stickGain ? 'good' : 'lagging';

    return {
      stickGain: Math.round(stickGain * 10) / 10,
      driverGain: Math.round(driverGain * 10) / 10,
      assessment,
    };
  }, [sessions]);

  // Weekly consistency — last 8 calendar weeks (Monday start)
  const weeklyConsistency = useMemo<WeekEntry[]>(() => {
    const today = new Date();
    // Find start of current week (Monday)
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const currentMonday = new Date(today);
    currentMonday.setDate(currentMonday.getDate() - diff);

    const weeks: WeekEntry[] = [];
    for (let i = 7; i >= 0; i--) {
      const monday = new Date(currentMonday);
      monday.setDate(monday.getDate() - i * 7);
      weeks.push({
        weekStart: formatDate(monday),
        count: 0,
        hitMinimum: false,
      });
    }

    // Count sessions per week
    for (const session of sessions) {
      const weekStart = getMondayOfWeek(session.date);
      const entry = weeks.find((w) => w.weekStart === weekStart);
      if (entry) entry.count++;
    }

    for (const w of weeks) {
      w.hitMinimum = w.count >= 3;
    }

    return weeks;
  }, [sessions]);

  // Protocol summary
  const protocolSummary = useMemo<ProtocolSummary | null>(() => {
    if (sessions.length === 0) return null;

    const first = sessions[0];
    const last = sessions[sessions.length - 1];

    const firstDriver = sessions.find((s) => s.maxOut.driver != null)?.maxOut.driver;
    const lastDriverSession = [...sessions].reverse().find((s) => s.maxOut.driver != null);
    const lastDriver = lastDriverSession?.maxOut.driver;

    const driverGain =
      firstDriver != null && lastDriver != null ? lastDriver - firstDriver : 0;

    return {
      name: first.protocol || 'SuperSpeed',
      totalSessions: sessions.length,
      firstDate: first.date,
      lastDate: last.date,
      driverGain: Math.round(driverGain * 10) / 10,
    };
  }, [sessions]);

  return {
    sessions,
    loading,
    driverSpeeds,
    stickPRs,
    domNonDomGap,
    transferRate,
    weeklyConsistency,
    protocolSummary,
  };
}
