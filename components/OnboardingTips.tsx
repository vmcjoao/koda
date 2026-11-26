import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrandWordmark } from '@/components/BrandWordmark';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, radii, spacing } from '@/constants/theme';

const KEY = 'koda.onboarding.v1';

const TIPS = [
  {
    title: 'Read, don’t code',
    body: 'Koda trains the phase before the keyboard — model the problem with tags, not syntax.',
  },
  {
    title: 'Daily Set of 3',
    body: 'Warm-up, Target, and Boss adapt to your band. Clear all three for a +50 XP bonus.',
  },
  {
    title: 'Review & Implement',
    body: 'Misses go to the Review deck. Blueprints wait in Implement until you AC them on a real OJ.',
  },
];

export function OnboardingTips() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const seen = await AsyncStorage.getItem(KEY);
      if (mounted && !seen) setVisible(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function finish() {
    await AsyncStorage.setItem(KEY, '1');
    setVisible(false);
  }

  function next() {
    if (step >= TIPS.length - 1) finish();
    else setStep((s) => s + 1);
  }

  const tip = TIPS[step];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={finish}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <BrandWordmark size="md" />
          <Text style={styles.kicker}>
            Tip {step + 1}/{TIPS.length}
          </Text>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.body}>{tip.body}</Text>
          <PrimaryButton label={step >= TIPS.length - 1 ? 'Start training' : 'Next'} onPress={next} />
          <Pressable onPress={finish}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  kicker: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  skip: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: spacing.sm,
  },
});
