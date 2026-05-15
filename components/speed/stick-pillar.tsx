import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  citron,
  greenDeep,
  sub,
  rule,
  FontFamily,
  stickColors,
} from '@/constants/design-tokens';
import type { StickColor } from '@/constants/speed-protocols';
import { SpeedCell } from './speed-cell';
import { SwingDots } from './swing-dots';

interface StickPillarBaseProps {
  stick: StickColor;
  active: boolean;
  animDelay?: number;
}

interface StickPillarNormalProps extends StickPillarBaseProps {
  variant?: 'normal';
  domValue: number | null;
  nonDomValue: number | null;
  focusedCell: 'dom' | 'nonDom' | null;
  onCellPress: (cell: 'dom' | 'nonDom') => void;
}

interface StickPillarMaxOutProps extends StickPillarBaseProps {
  variant: 'maxOut';
  value: number | null;
  focused: boolean;
  onCellPress: () => void;
}

type StickPillarProps = StickPillarNormalProps | StickPillarMaxOutProps;

function StickRing({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Circle cx={7} cy={7} r={5.5} fill="none" stroke={color} strokeWidth={2.5} />
      <Circle cx={7} cy={7} r={2} fill={color} />
    </Svg>
  );
}

const STICK_LABELS: Record<StickColor, string> = {
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
};

const STICK_MAXOUT_LABELS: Record<StickColor, string> = {
  green: 'Green Stick',
  blue: 'Blue Stick',
  red: 'Red Stick',
};

export function StickPillar(props: StickPillarProps) {
  const { stick, active, animDelay = 0 } = props;
  const isMaxOut = props.variant === 'maxOut';
  const sc = stickColors[stick];
  const muted = !active;
  const gripLabel = isMaxOut ? STICK_MAXOUT_LABELS[stick] : STICK_LABELS[stick];

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(animDelay).springify()}
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`${gripLabel} training stick${active ? ', active' : ''}`}
    >
      {/* Tee cap */}
      {active ? (
        <View style={styles.capWrapper}>
          <View style={styles.arrowIndicator} />
          <View
            style={[
              isMaxOut ? styles.capActiveMaxOut : styles.capActive,
              {
                backgroundColor: sc,
                borderColor: citron,
                shadowColor: sc,
              },
            ]}
          />
        </View>
      ) : (
        <View style={styles.ringWrapper}>
          <StickRing color={sc} />
        </View>
      )}

      {/* Grip band */}
      {active ? (
        <View
          style={[
            isMaxOut ? styles.gripBandActiveMaxOut : styles.gripBandActive,
            { backgroundColor: sc },
          ]}
        >
          <Text style={isMaxOut ? styles.gripNameActiveMaxOut : styles.gripNameActive}>
            {gripLabel}
          </Text>
        </View>
      ) : (
        <View style={isMaxOut ? styles.gripBandMutedMaxOut : styles.gripBandMuted}>
          <Text style={styles.gripNameMuted}>{gripLabel}</Text>
        </View>
      )}

      {/* Shaft */}
      <View
        style={[
          isMaxOut ? styles.shaftMaxOut : styles.shaft,
          active
            ? {
                backgroundColor: '#fff',
                borderColor: sc,
                shadowColor: '#11371f',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.14,
                shadowRadius: 22,
                elevation: 6,
              }
            : {
                backgroundColor: isMaxOut ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.4)',
                borderColor: rule,
              },
        ]}
      >
        {active && (
          <View style={[styles.groove, { backgroundColor: sc + '22' }]} />
        )}

        {isMaxOut ? (
          // Single large SPEED cell for Max Out
          <SpeedCell
            label="SPEED"
            value={props.value}
            focused={props.focused}
            muted={muted}
            accentColor={sc}
            variant="large"
            onPress={props.onCellPress}
          />
        ) : (
          // DOM + NON-DOM cells for Normal Stance / Step Drill
          <>
            <SpeedCell
              label="DOM"
              value={props.domValue}
              focused={props.focusedCell === 'dom'}
              muted={muted}
              accentColor={sc}
              variant="small"
              onPress={() => props.onCellPress('dom')}
            />
            <SpeedCell
              label="NON-DOM"
              value={props.nonDomValue}
              focused={props.focusedCell === 'nonDom'}
              muted={muted}
              accentColor={sc}
              variant="small"
              onPress={() => props.onCellPress('nonDom')}
            />
          </>
        )}

        <SwingDots color={sc} muted={muted} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  capWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: -2,
    zIndex: 2,
  },
  arrowIndicator: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: greenDeep,
    marginBottom: 4,
  },
  capActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  capActiveMaxOut: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  ringWrapper: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  gripBandActive: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gripBandActiveMaxOut: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gripNameActive: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 12,
    color: '#fff',
    letterSpacing: -0.005 * 12,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  gripNameActiveMaxOut: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.005 * 14,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  gripBandMuted: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: rule,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gripBandMutedMaxOut: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: rule,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gripNameMuted: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 12,
    color: sub,
    letterSpacing: -0.005 * 12,
  },
  shaft: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    paddingBottom: 14,
    gap: 6,
  },
  shaftMaxOut: {
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    paddingBottom: 18,
    justifyContent: 'center',
  },
  groove: {
    position: 'absolute',
    top: 4,
    bottom: 18,
    left: '50%',
    width: 1,
    transform: [{ translateX: -0.5 }],
  },
});
