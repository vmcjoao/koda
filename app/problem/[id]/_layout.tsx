import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { ProblemFlowChrome } from '@/components/ProblemFlowChrome';
import { AttemptProvider } from '@/contexts/AttemptContext';
import { colors } from '@/constants/theme';

/**
 * One nested stack per problem id. Keeps Encounter→Reveal params isolated so
 * opening problem B cannot rewrite leftover screens from problem A.
 */
export default function ProblemFlowLayout() {
  return (
    <AttemptProvider>
      <View style={styles.root}>
        <ProblemFlowChrome />
        <Stack
          style={styles.stack}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade_from_bottom',
            animationDuration: 280,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="radar" />
          <Stack.Screen name="hypothesis" />
          <Stack.Screen name="blueprint" />
          <Stack.Screen name="stuck" />
          <Stack.Screen name="reveal" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </View>
    </AttemptProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stack: {
    flex: 1,
  },
});
