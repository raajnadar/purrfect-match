/**
 * A pulsing placeholder for content that is still loading.
 *
 * The pulse is a 3-step opacity keyframe on a repeating timing transition, so
 * it returns to its start value and never jumps.
 */
import { useTheme } from '@rootnative/core'
import { Motion } from '@rootnative/inertia'
import type { StyleProp, ViewStyle } from 'react-native'

import type { PurrfectTheme } from '../theme'

interface SkeletonProps {
  style?: StyleProp<ViewStyle>
  /** Override the placeholder fill. Defaults to the highest surface tone. */
  color?: string
}

export function Skeleton({ style, color }: SkeletonProps) {
  const theme = useTheme<PurrfectTheme>()

  return (
    <Motion.View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[
        { backgroundColor: color ?? theme.colors.surfaceContainerHighest },
        style,
      ]}
      initial={{ opacity: 0.45 }}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{
        type: 'timing',
        duration: theme.motion.durationExtraLong2,
        repeat: 'infinite',
      }}
    />
  )
}
