import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SymbolBar } from '@/components/SymbolBar';
import { useAttempt } from '@/contexts/AttemptContext';
import { colors, radii, spacing } from '@/constants/theme';

export default function BlueprintScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { problem, draft, setPseudocode } = useAttempt();

  if (!problem || !draft || problem.id !== id) {
    return (
      <Screen>
        <Text style={styles.muted}>Open the encounter first.</Text>
        <PrimaryButton label="Back" onPress={() => router.replace(`/problem/${id}`)} />
      </Screen>
    );
  }

  function insert(symbol: string) {
    const next = draft!.pseudocode ? `${draft!.pseudocode}${symbol}` : symbol;
    setPseudocode(next);
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>Blueprint</Text>
      <Text style={styles.sub}>
        Optional scratchpad for state transitions, recurrences, and edge cases to code later.
      </Text>

      <SymbolBar onInsert={insert} />

      <TextInput
        style={styles.editor}
        multiline
        textAlignVertical="top"
        placeholder={`dp[i] → ...\nfor i in 1..n:\n  ...`}
        placeholderTextColor={colors.textDim}
        value={draft.pseudocode}
        onChangeText={setPseudocode}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={styles.actions}>
        <PrimaryButton label="Submit hypothesis" onPress={() => router.push(`/problem/${id}/reveal`)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 14,
  },
  editor: {
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    padding: spacing.md,
    lineHeight: 22,
  },
  actions: {
    marginTop: spacing.sm,
  },
  muted: {
    color: colors.textMuted,
  },
});
