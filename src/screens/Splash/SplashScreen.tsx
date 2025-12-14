import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {apiKey, isLoading} = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        // Navigate based on API key presence
        if (apiKey) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Main' as never}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login' as never}],
          });
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [apiKey, isLoading, navigation]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🩺</Text>
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.title}>MediScript AI</Text>
        <Text style={styles.subtitle}>Enterprise Medical Platform</Text>

        {/* Loading Indicator */}
        <ActivityIndicator
          size="large"
          color={colors.surface}
          style={styles.loader}
        />

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  loader: {
    marginTop: spacing.xl,
  },
  version: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
    bottom: spacing.xl,
  },
});

export default SplashScreen;
