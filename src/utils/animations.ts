import { Animated, Easing } from 'react-native';

// Animation configurations
export const animations = {
  // Slide animations
  slideIn: (duration: number = 300) => ({
    duration,
    easing: Easing.out(Easing.exp),
    useNativeDriver: true,
  }),

  slideOut: (duration: number = 250) => ({
    duration,
    easing: Easing.in(Easing.exp),
    useNativeDriver: true,
  }),

  // Fade animations
  fadeIn: (duration: number = 200) => ({
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }),

  fadeOut: (duration: number = 150) => ({
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }),

  // Scale animations
  scaleIn: (duration: number = 200) => ({
    duration,
    easing: Easing.back(1.2),
    useNativeDriver: true,
  }),

  scaleOut: (duration: number = 150) => ({
    duration,
    easing: Easing.in(Easing.back(1.2)),
    useNativeDriver: true,
  }),

  // Spring animations
  spring: (tension: number = 65, friction: number = 8) => ({
    tension,
    friction,
    useNativeDriver: true,
  }),
};

// Animated components
export const createFadeInAnimation = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.exp),
    useNativeDriver: true,
  });
};

export const createSlideUpAnimation = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.out(Easing.back(1.1)),
    useNativeDriver: true,
  });
};

export const createPulseAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

// Stagger animation utility
export const createStaggerAnimation = (
  animatedValues: Animated.Value[],
  staggerDelay: number = 100,
  animation: (value: Animated.Value, delay: number) => Animated.CompositeAnimation
) => {
  return Animated.stagger(
    staggerDelay,
    animatedValues.map((value, index) => animation(value, index * staggerDelay))
  );
};

// Common animated styles
export const animatedStyles = {
  fadeIn: (opacity: Animated.Value) => ({
    opacity,
  }),

  slideUp: (translateY: Animated.Value) => ({
    transform: [{ translateY }],
  }),

  scaleIn: (scale: Animated.Value) => ({
    transform: [{ scale }],
  }),

  slideInFromRight: (translateX: Animated.Value) => ({
    transform: [{ translateX }],
  }),

  slideInFromLeft: (translateX: Animated.Value) => ({
    transform: [{ translateX: translateX.interpolate({
      inputRange: [-1, 0],
      outputRange: [-300, 0],
    }) }],
  }),
};
