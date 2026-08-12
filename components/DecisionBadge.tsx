/**
 * The "YES" / "NO" stamp that fades in as the card crosses its threshold.
 *
 * Opacity, scale, and the static tilt all come from one `useInterpolatedStyle`
 * call. The tilt has equal endpoints because a separate static `rotate` style
 * would replace the interpolated `transform` array instead of adding to it.
 */
import { Typography } from '@rootnative/components/typography'
import { useTheme } from '@rootnative/core'
import { Motion, useInterpolatedStyle, type SharedValue } from '@rootnative/inertia'
import { StyleSheet } from 'react-native'

import type { PurrfectTheme } from '../theme'

interface DecisionBadgeProps {
  decision: 'yes' | 'no'
  /** The card's live x translation, in px. */
  progress: SharedValue<number>
  /** Distance in px that commits the swipe. The stamp is solid there. */
  threshold: number
}

/** The stamp starts to appear at this fraction of the commit threshold. */
const FADE_IN_AT = 0.2

export function DecisionBadge({
  decision,
  progress,
  threshold,
}: DecisionBadgeProps) {
  const { purrfect, shape } = useTheme<PurrfectTheme>()

  const isYes = decision === 'yes'
  const tokens = isYes ? purrfect.yes : purrfect.no
  const tilt = isYes ? -14 : 14

  const stampStyle = useInterpolatedStyle(
    progress,
    isYes
      ? { scale: [0.72, 1], rotate: [tilt, tilt], opacity: [0, 1] }
      : { scale: [1, 0.72], rotate: [tilt, tilt], opacity: [1, 0] },
    {
      inputRange: isYes
        ? [threshold * FADE_IN_AT, threshold]
        : [-threshold, -threshold * FADE_IN_AT],
    },
  )

  return (
    <Motion.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.stamp,
        isYes ? styles.yes : styles.no,
        {
          borderColor: tokens.color,
          backgroundColor: tokens.container,
          borderRadius: shape.cornerLarge,
        },
        stampStyle,
      ]}
    >
      <Typography variant="titleLargeEmphasized" color={tokens.onContainer}>
        {isYes ? 'YES' : 'NO'}
      </Typography>
    </Motion.View>
  )
}

const styles = StyleSheet.create({
  stamp: {
    position: 'absolute',
    top: 24,
    borderWidth: 3,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  yes: {
    left: 24,
  },
  no: {
    right: 24,
  },
})
