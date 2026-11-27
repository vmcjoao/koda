import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '@/constants/theme';

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

type Props = {
  label?: string;
  options: FilterOption[];
  /** Selected option ids. Empty means "no filter" / show all. */
  selected: string[];
  onChange: (selected: string[]) => void;
  /** Allow multiple chips on at once. Default false (radio). */
  multi?: boolean;
  /** Horizontal scroll instead of wrap. Default true for compact rows. */
  scroll?: boolean;
};

export function FilterBar({
  label,
  options,
  selected,
  onChange,
  multi = false,
  scroll = true,
}: Props) {
  function toggle(id: string) {
    if (multi) {
      if (selected.includes(id)) {
        onChange(selected.filter((x) => x !== id));
      } else {
        onChange([...selected, id]);
      }
      return;
    }
    onChange(selected.includes(id) ? [] : [id]);
  }

  const chips = options.map((opt) => {
    const on = selected.includes(opt.id);
    const countSuffix = opt.count != null ? ` ${opt.count}` : '';
    return (
      <Pressable
        key={opt.id}
        onPress={() => toggle(opt.id)}
        style={[styles.chip, on && styles.chipOn]}
      >
        <Text style={[styles.chipText, on && styles.chipTextOn]}>
          {opt.label}
          {countSuffix}
        </Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {scroll ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {chips}
        </ScrollView>
      ) : (
        <View style={styles.wrapRow}>{chips}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipOn: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelectedBorder,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextOn: {
    color: colors.accent,
  },
});
