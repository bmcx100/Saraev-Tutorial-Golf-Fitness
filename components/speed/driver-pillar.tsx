import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  citron,
  greenDeep,
  rule,
  FontFamily,
} from '@/constants/design-tokens';
import { SpeedCell } from './speed-cell';
import { SwingDots } from './swing-dots';

interface DriverPillarProps {
  active: boolean;
  value: number | null;
  focused: boolean;
  onCellPress: () => void;
  animDelay?: number;
  prValue?: number;
}

function DriverHead() {
  return (
    <Svg width={34} height={24} viewBox="0 0 26 20" style={{ display: 'flex' }}>
      <Path
        d="M3 11 Q3 4 10 4 Q18 4 22 8 Q24 10 22 12 Q18 16 10 16 Q3 16 3 11 Z"
        fill="#1f2622"
      />
      <Path d="M19 7 L22 9 L19 11 Z" fill="#3a4540" />
    </Svg>
  );
}

export function DriverPillar({
  active,
  value,
  focused,
  onCellPress,
  animDelay = 0,
  prValue,
}: DriverPillarProps) {
  const accentBand = greenDeep;

  return (
    <Animated.View
      entering={FadeInUp.duration(300).delay(animDelay).springify()}
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`Driver${active ? ', active' : ''}`}
    >
      {/* Driver-head cap */}
      <View style={styles.capWrapper}>
        {active && <View style={styles.arrowIndicator} />}
        <View
          style={[
            styles.cap,
            active
              ? {
                  borderWidth: 2,
                  borderColor: citron,
                  shadowColor: citron,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 4,
                }
              : {
                  borderWidth: 1,
                  borderColor: rule,
                  shadowColor: '#0e2118',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 4,
                  elevation: 2,
                },
          ]}
        >
          <DriverHead />
        </View>
      </View>

      {/* Grip band */}
      <View style={styles.gripBand}>
        <Text style={styles.gripName}>Driver</Text>
      </View>

      {/* Shaft */}
      <View
        style={[
          styles.shaft,
          active
            ? {
                backgroundColor: '#fff',
                borderColor: accentBand,
                shadowColor: '#11371f',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.14,
                shadowRadius: 22,
                elevation: 6,
              }
            : {
                backgroundColor: 'rgba(255,255,255,0.55)',
                borderColor: rule,
              },
        ]}
      >
        {/* Center groove */}
        {active && <View style={styles.groove} />}

        <SpeedCell
          label="SPEED"
          value={value}
          focused={focused}
          muted={!active}
          accentColor={accentBand}
          variant="large"
          onPress={onCellPress}
          prValue={prValue}
        />

        <SwingDots color={accentBand} muted={!active} />
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
    marginBottom: -4,
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
  cap: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripBand: {
    backgroundColor: greenDeep,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  gripName: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.005 * 14,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  shaft: {
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
    top: 6,
    bottom: 18,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(17,55,31,0.16)',
    transform: [{ translateX: -0.5 }],
  },
});
