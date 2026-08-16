/**
 * The match strength for one gift, drawn as a ring around its icon.
 *
 * This is the app's central idea made visible: a swipe deck builds a profile,
 * and every gift in the catalogue scores against it. The ring is the score.
 *
 * The arc draws with a static `strokeDasharray` of the circumference and an
 * animated `strokeDashoffset`, which is the documented `MotionCircle` pattern.
 * The ring inherits the row's `<Stagger>` delay, so the arcs sweep in one after
 * another rather than all at once.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '@rootnative/core'
import { MotionCircle } from '@rootnative/inertia-svg'
import type { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg from 'react-native-svg'

import type { PurrfectTheme } from '../theme'

/** Drawing space. The ring scales to `size`, so these are ratios, not pixels. */
const VIEW_BOX = 100
const RADIUS = 44
const STROKE_WIDTH = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface MatchRingProps {
  /** Match strength from 1 to 100. */
  percent: number
  /** Outer side of the ring, in dp. */
  size: number
  /** Icon drawn inside the ring. */
  icon: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** Product color. The icon takes it, so each row keeps its own identity. */
  swatch: string
  /** False holds the arc at zero until the sheet settles. */
  revealed: boolean
}

export function MatchRing({
  percent,
  size,
  icon,
  swatch,
  revealed,
}: MatchRingProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion, purrfect } = theme

  const progress = Math.max(0, Math.min(1, percent / 100))

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`} width={size} height={size}>
        {/* The track shows the part of the ring the score did not reach, so a
            weak match reads as a short arc rather than a small circle. */}
        <MotionCircle
          cx={VIEW_BOX / 2}
          cy={VIEW_BOX / 2}
          r={RADIUS}
          stroke={colors.surfaceContainerHighest}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <MotionCircle
          cx={VIEW_BOX / 2}
          cy={VIEW_BOX / 2}
          r={RADIUS}
          stroke={purrfect.yes.color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          // The arc starts at 12 o'clock instead of 3 o'clock, which is where
          // a score reads from.
          rotation={-90}
          origin={`${VIEW_BOX / 2}, ${VIEW_BOX / 2}`}
          strokeDasharray={[CIRCUMFERENCE]}
          strokeDashoffset={CIRCUMFERENCE}
          animate={{
            strokeDashoffset: revealed
              ? CIRCUMFERENCE * (1 - progress)
              : CIRCUMFERENCE,
          }}
          transition={{ type: 'spring', ...motion.springSlowSpatial }}
        />
      </Svg>

      <View style={styles.icon} pointerEvents="none">
        <MaterialCommunityIcons name={icon} size={size * 0.4} color={swatch} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
