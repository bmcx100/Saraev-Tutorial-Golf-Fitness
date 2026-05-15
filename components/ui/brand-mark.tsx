import Svg, { Circle, Path } from 'react-native-svg';
import { citron, cream, forest, greenDeep } from '@/constants/design-tokens';

interface BrandMarkProps {
  size?: number;
  onDark?: boolean;
}

/**
 * Brand mark: concentric rings with citron flag disc and progress arc.
 * Used on sign-in hero, splash, header, achievements.
 */
export function BrandMark({ size = 72, onDark = false }: BrandMarkProps) {
  const c = size / 2;
  const track = onDark ? 'rgba(251,246,230,0.22)' : 'rgba(29,78,52,0.22)';
  const arcStroke = onDark ? cream : forest;
  const r1 = size / 2 - 4;
  const r2 = r1 - 9;
  const r3 = r2 - 9;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer track ring */}
      <Circle cx={c} cy={c} r={r1} fill="none" stroke={track} strokeWidth={2} />
      {/* Middle track ring */}
      <Circle cx={c} cy={c} r={r2} fill="none" stroke={track} strokeWidth={2} />
      {/* Inner citron disc */}
      <Circle cx={c} cy={c} r={r3} fill={citron} />
      {/* Flag pole */}
      <Path
        d={`M ${c - 0.5} ${c - r3 + 2} L ${c - 0.5} ${c + r3 - 4}`}
        stroke={greenDeep}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Flag pennant */}
      <Path
        d={`M ${c} ${c - r3 + 3} L ${c + r3 - 4} ${c - r3 + 7} L ${c} ${c - r3 + 11} Z`}
        fill={greenDeep}
      />
      {/* Progress arc dash (32% of circumference, rotated -78deg) */}
      <Circle
        cx={c}
        cy={c}
        r={r1}
        fill="none"
        stroke={arcStroke}
        strokeWidth={2}
        strokeDasharray={`${2 * Math.PI * r1 * 0.32} ${2 * Math.PI * r1}`}
        strokeLinecap="round"
        rotation={-78}
        origin={`${c}, ${c}`}
      />
    </Svg>
  );
}
