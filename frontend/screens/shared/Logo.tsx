import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { GraduationCap, RefreshCw } from 'lucide-react-native';

type Props = {
  size?: number;
};

const Logo = ({ size = 64 }: Props) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.glow} />

      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <GraduationCap size={size * 0.6} color="#4f46e5" />

          <Animated.View
            style={[
              styles.refreshWrapper,
              { transform: [{ rotate: spin }] },
            ]}
          >
            <RefreshCw size={12} color="#818cf8" />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  glow: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    backgroundColor: '#6366f1a4',
    borderRadius: 20,
    opacity: 0.2,
    transform: [{ rotate: '12deg' }],
  },

  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  iconWrapper: {
    position: 'relative',
  },

  refreshWrapper: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#eef2ff',
  },
});