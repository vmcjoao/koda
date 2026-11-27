import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { fitScale } from '@/components/learn/viz/vizCanvas';

type Props = {
  /** Design width the children are laid out for. */
  logicalWidth: number;
  /** Design height (used for the scaled box). */
  logicalHeight: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Measures parent width and uniformly scales children so a fixed logical canvas
 * never overflows the Replay stage. Scale origin is top-left.
 */
export function FitCanvas({ logicalWidth, logicalHeight, children, style }: Props) {
  const [parentW, setParentW] = useState(logicalWidth);

  function onLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - parentW) > 0.5) setParentW(w);
  }

  const scale = fitScale(parentW, logicalWidth);
  const boxW = logicalWidth * scale;
  const boxH = logicalHeight * scale;
  // RN scales from center by default — nudge so the top-left stays put.
  const shiftX = -((logicalWidth - boxW) / 2);
  const shiftY = -((logicalHeight - boxH) / 2);

  return (
    <View style={[styles.measure, style]} onLayout={onLayout}>
      <View style={{ width: boxW, height: boxH, alignSelf: 'center', overflow: 'hidden' }}>
        <View
          style={{
            width: logicalWidth,
            height: logicalHeight,
            transform: [{ translateX: shiftX }, { translateY: shiftY }, { scale }],
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  measure: { width: '100%', alignItems: 'center' },
});
