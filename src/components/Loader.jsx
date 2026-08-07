import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Animated, Easing } from 'react-native';

export default function Loader({ visible }) {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const createBarAnimation = (animatedValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1200, 
            easing: Easing.bezier(0, 0.5, 0.5, 1),
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animation1 = createBarAnimation(anim1, 0);
    const animation2 = createBarAnimation(anim2, 120);
    const animation3 = createBarAnimation(anim3, 240);

    Animated.parallel([animation1, animation2, animation3]).start();

    return () => {
      anim1.stopAnimation();
      anim2.stopAnimation();
      anim3.stopAnimation();
    };
  }, [visible, anim1, anim2, anim3]);

  const getBarStyles = (animatedValue) => {
    const top = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [8, 24, 24], 
    });

    const height = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [64, 32, 32], 
    });

    return { top, height };
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.bar, { left: 8 }, getBarStyles(anim1)]} />
          <Animated.View style={[styles.bar, { left: 32 }, getBarStyles(anim2)]} />
          <Animated.View style={[styles.bar, { left: 56 }, getBarStyles(anim3)]} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    width: 16,
    backgroundColor: '#000', 
    borderRadius: 2, 
  },
});
