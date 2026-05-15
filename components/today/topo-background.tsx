import { StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { topoStroke } from '@/constants/design-tokens';

interface TopoBackgroundProps {
  tint?: string;
  opacity?: number;
  /** Viewbox height — use ~900 for full page, ~280 for card interior */
  viewBoxHeight?: number;
}

/**
 * Decorative topographic contour lines.
 * Renders as an absolute-fill SVG overlay.
 */
export function TopoBackground({
  tint = topoStroke,
  opacity = 0.55,
  viewBoxHeight = 900,
}: TopoBackgroundProps) {
  // Generate different path sets based on viewbox
  const isCard = viewBoxHeight < 400;

  return (
    <Svg
      style={[StyleSheet.absoluteFill, { opacity }]}
      width="100%"
      height="100%"
      viewBox={`0 0 390 ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <G fill="none" stroke={tint} strokeWidth={0.9}>
        {isCard ? (
          <>
            <Path d="M-20 50 C 80 25, 200 90, 380 40" />
            <Path d="M-20 90 C 80 65, 200 140, 380 80" />
            <Path d="M-20 140 C 80 115, 200 200, 380 130" />
            <Path d="M-20 200 C 80 175, 200 250, 380 190" />
          </>
        ) : (
          <>
            <Path d="M-50 120 C 80 60, 220 200, 460 100" />
            <Path d="M-50 200 C 80 140, 220 280, 460 180" />
            <Path d="M-50 320 C 120 260, 260 420, 460 330" />
            <Path d="M-50 500 C 100 440, 280 600, 460 510" />
            <Path d="M-50 660 C 90 600, 260 760, 460 680" />
            <Path d="M-50 740 C 80 690, 260 830, 460 760" />
          </>
        )}
      </G>
    </Svg>
  );
}
