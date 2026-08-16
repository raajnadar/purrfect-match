/**
 * Phase 2 — the gift reveal.
 *
 * A draggable bottom sheet slides up when the deck ends. The rows inside
 * cascade in once the sheet settles at a snap point, not on mount. That order
 * matters: a stagger that runs while the sheet is still travelling reads as two
 * competing animations.
 *
 * `BottomSheet` owns the drag, the snap points, and the scrim. It needs a
 * `PortalHost` at the app root — see `app/_layout.tsx`.
 *
 * The sheet surface is sized to the **tallest** snap point, and a lower snap is
 * that same surface translated down. So at the short snap the bottom of the
 * surface sits below the screen edge. A `ScrollView` that fills the surface
 * measures its viewport as the full height, finds no overflow, and refuses to
 * scroll — the last rows and the button stay unreachable. We cap the scroll
 * viewport to the height the active snap actually shows.
 */
import { BottomSheet } from '@rootnative/components/bottom-sheet'
import { Button } from '@rootnative/components/button'
import { Column, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useBreakpointValue, useTheme } from '@rootnative/core'
import { Motion, Stagger } from '@rootnative/inertia'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { pickGifts } from '../data/gifts'
import type { Trait } from '../data/traits'
import type { PurrfectTheme } from '../theme'
import { GiftListItem } from './GiftListItem'

/**
 * Delay between the sheet opening and the first row entering. The sheet's own
 * travel needs to be visibly under way before the cascade starts, or the two
 * animations read as one confused move.
 */
const REVEAL_DELAY_MS = 220

/** Delay in ms between one row's entrance and the next. */
const STAGGER_MS = 60

/**
 * Resting heights, as a percentage of the window. Kept as numbers so the
 * scroll viewport can be measured from the same values the sheet snaps to,
 * and sorted ascending to match the indices `onSnapIndexChange` reports.
 */
const SNAP_PERCENTS = [55, 92]

const SNAP_POINTS = SNAP_PERCENTS.map((percent) => `${percent}%` as const)

/**
 * Height of the sheet's drag handle: a 4 px bar with 22 px above and below.
 * The handle sits above the content, so it comes off the usable height.
 */
const DRAG_HANDLE_HEIGHT = 48

interface GiftSheetProps {
  visible: boolean
  /** The traits the user said yes to. Drives the recommendation. */
  accepted: Trait[]
  onDismiss: () => void
  onSelectGift: (giftId: string, matchPercent: number) => void
  onRestart: () => void
}

export function GiftSheet({
  visible,
  accepted,
  onDismiss,
  onSelectGift,
  onRestart,
}: GiftSheetProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion } = theme

  const [revealed, setRevealed] = useState(false)
  const [snapIndex, setSnapIndex] = useState(0)

  const { height: windowHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const matches = pickGifts(accepted)
  // `pickGifts` sorts by score, so the first row is the headline result.
  const topMatch = matches[0]

  // What the active snap shows, less the handle above the content and the
  // bottom inset the sheet pads with. This is the real viewport, so the
  // ScrollView can now see that its content overflows.
  const snapPercent = SNAP_PERCENTS[snapIndex] ?? SNAP_PERCENTS[0]
  const visibleHeight = Math.max(
    0,
    (windowHeight * snapPercent) / 100 - DRAG_HANDLE_HEIGHT - insets.bottom,
  )

  // On a wide window the sheet's own width is capped by the host, so the
  // content column is what needs the cap. The list must not run edge to edge
  // across a desktop browser.
  const contentWidth = useBreakpointValue({
    compact: undefined,
    medium: 520,
    expanded: 600,
  })

  useEffect(() => {
    if (!visible) {
      setRevealed(false)
      // The sheet reopens at the lowest snap, so the viewport must match.
      setSnapIndex(0)
      return
    }
    const timer = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [visible])

  // A drag to a taller snap point must not replay the cascade. Once the rows
  // are in, they stay in. The index also resizes the scroll viewport.
  const handleSnapIndexChange = useCallback((index: number) => {
    setSnapIndex(index)
    setRevealed(true)
  }, [])

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoints={SNAP_POINTS}
      onSnapIndexChange={handleSnapIndexChange}
      containerColor={colors.surfaceContainerLow}
    >
      <ScrollView
        // The cap is what makes the list scrollable at the short snap. Without
        // it the ScrollView fills the whole surface, half of which is off
        // screen, so it sees no overflow to scroll.
        style={{ maxHeight: visibleHeight }}
        contentContainerStyle={[styles.scroll, { maxWidth: contentWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <Column gap="md" style={styles.column}>
          {/* The header leads the cascade at index 0, so the rows read as
              following it rather than racing it. */}
          <Motion.View
            initial={{ opacity: 0, translateY: 20 }}
            animate={
              revealed
                ? { opacity: 1, translateY: 0 }
                : { opacity: 0, translateY: 20 }
            }
            transition={{ type: 'spring', ...motion.springDefaultSpatial }}
          >
            <Column gap="xs">
              <Typography
                variant="headlineSmallEmphasized"
                color={colors.primary}
              >
                {topMatch ? 'Your purrfect match' : 'No match yet'}
              </Typography>
              <Typography variant="bodyMedium" color={colors.onSurfaceVariant}>
                {topMatch
                  ? `${topMatch.gift.name} fits your cat by ${topMatch.matchPercent}%. ${matches.length} matches from ${accepted.length} traits.`
                  : 'You said no to every trait, so there is nothing to match against.'}
              </Typography>
            </Column>
          </Motion.View>

          {matches.length > 0 ? (
            <Column gap="sm">
              <Stagger
                interval={STAGGER_MS}
                delay={STAGGER_MS}
                enabled={revealed}
              >
                {matches.map((match) => (
                  <GiftListItem
                    key={match.gift.id}
                    match={match}
                    revealed={revealed}
                    onPress={onSelectGift}
                  />
                ))}
              </Stagger>
            </Column>
          ) : null}

          <Row gap="sm" style={styles.actions}>
            <Button
              variant="tonal"
              leadingIcon="restart"
              style={styles.action}
              onPress={onRestart}
            >
              Start again
            </Button>
          </Row>
        </Column>
      </ScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    // Centres the column once `maxWidth` caps it on a wide window.
    width: '100%',
    alignSelf: 'center',
  },
  column: {
    width: '100%',
  },
  actions: {
    width: '100%',
  },
  action: {
    flex: 1,
  },
})
