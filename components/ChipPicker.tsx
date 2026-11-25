import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing } from '@/constants/theme';
import { fuzzyMatch } from '@/lib/scoring';

type Item = {
  label: string;
  aliases?: string[];
};

type Props = {
  title: string;
  items: Item[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  hint?: string;
};

export function ChipPicker({ title, items, selected, onChange, multi = true, hint }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => items.filter((item) => fuzzyMatch(query, item.label, item.aliases ?? [])),
    [items, query],
  );

  function toggle(label: string) {
    if (multi) {
      if (selected.includes(label)) {
        onChange(selected.filter((s) => s !== label));
      } else {
        onChange([...selected, label]);
      }
    } else {
      onChange(selected[0] === label ? [] : [label]);
    }
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search…"
        placeholderTextColor={colors.textDim}
        style={styles.search}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <View style={styles.row}>
        {filtered.map((item) => {
          const active = selected.includes(item.label);
          return (
            <Pressable
              key={item.label}
              onPress={() => toggle(item.label)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {selected.length > 0 ? (
        <Text style={styles.selectedCount}>{selected.length} selected</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.accent,
  },
  selectedCount: {
    color: colors.textDim,
    fontSize: 12,
  },
});
